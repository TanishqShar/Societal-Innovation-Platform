"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  addProblem,
  updateProblem,
  getProblems,
  addProject,
  updateProject,
  addMilestone,
  updateMilestone,
  addIndustryParticipation,
  addNotification,
  markNotificationRead as dbMarkNotificationRead,
  addFeedback,
  addImpactMetric,
  saveAnalysis,
  addProjectMember,
  removeProjectMember,
  saveProjectProposal,
  updateProposalStatus,
  addPatent,
  addStartup,
  addDiscussion,
  updateProjectTrl,
  addSolution,
} from "@/lib/db";
import { classify, routeToUniversity, type Category, type ChallengeStatus, type ProjectStatus } from "@/lib/domain";
import { analyzeChallenge } from "@/lib/ai";
import { rankUniversities } from "@/lib/matching";
import { type Role, SESSION_COOKIE } from "@/lib/auth";
import type { Challenge, ProposalStatus, PatentRecord, StartupIncubation, ProjectDiscussion, Solution } from "@/lib/types";

// Shared demo password for staff roles.
const STAFF_PASSWORD = "demo123";

// ---- Auth -------------------------------------------------------------------

export async function login(formData: FormData) {
  const role = String(formData.get("role") ?? "") as Role;
  const name =
    String(formData.get("name") ?? "").trim() ||
    (role === "citizen" ? "Citizen" : "Staff");
  const password = String(formData.get("password") ?? "");

  const staffRoles: Role[] = ["admin", "university", "government", "industry"];
  if (staffRoles.includes(role) && password !== STAFF_PASSWORD) {
    redirect("/login?error=1");
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, JSON.stringify({ name, role }), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8,
    sameSite: "lax",
  });

  if (role === "citizen") redirect("/citizen");
  if (role === "university") redirect("/university");
  if (role === "industry") redirect("/industry");
  if (role === "government") redirect("/analytics");
  redirect("/dashboard");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/");
}

// ---- Submit Challenge -------------------------------------------------------

export async function submitProblem(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const state = String(formData.get("state") ?? "Jharkhand").trim() || "Jharkhand";
  const district = String(formData.get("district") ?? "").trim();
  const village_ward = String(formData.get("village_ward") ?? "").trim() || null;
  const submitter_name = String(formData.get("submitter_name") ?? "").trim() || null;
  const submitter_type = (String(formData.get("submitter_type") ?? "").trim() || "citizen") as Challenge["submitter_type"];
  const photo_url = String(formData.get("photo_url") ?? "").trim() || null;
  const video_url = String(formData.get("video_url") ?? "").trim() || null;
  const latStr = String(formData.get("location_lat") ?? "").trim();
  const lngStr = String(formData.get("location_lng") ?? "").trim();
  const location_lat = latStr ? parseFloat(latStr) : null;
  const location_lng = lngStr ? parseFloat(lngStr) : null;

  if (!title || !description || !district) return;

  // Keyword-based categorisation (quick, synchronous)
  const category = classify(`${title} ${description}`);

  const challengeId = await addProblem({
    title,
    description,
    category,
    state,
    district,
    village_ward,
    submitter_name,
    submitter_type,
    photo_url,
    video_url,
    location_lat,
    location_lng,
    subcategory: null,
    priority: null,
    priority_score: null,
  });

  // Run AI analysis asynchronously (does not block the redirect)
  try {
    const existing = await getProblems();
    const analysis = await analyzeChallenge(
      title,
      description,
      existing.filter((p) => p.id !== challengeId),
      { state, district, local_area: village_ward || undefined }
    );
    await saveAnalysis({ ...analysis, challenge_id: challengeId });
    // Automatically rank and route to the #1 best matched institution
    const matches = rankUniversities(analysis.category, analysis.required_disciplines, {
      state,
      district,
      title,
      description,
      expertiseNeeded: analysis.relevant_expertise ?? analysis.required_disciplines,
    });
    const topMatch = matches[0]?.university_name || routeToUniversity(category, state);

    // Update the challenge with AI-derived priority, assigned university, and status
    await updateProblem(challengeId, {
      priority: analysis.priority,
      priority_score: analysis.priority_score,
      subcategory: analysis.subcategory,
      assigned_to: topMatch,
      status: "assigned",
    });

    // Notify the university
    await addNotification({
      user_name: topMatch,
      user_role: "university",
      title: "New Challenge Matched & Assigned",
      message: `"${title}" in ${district}, ${state} has been matched and assigned to ${topMatch} (${matches[0]?.score ?? 90}/100).`,
      type: "info",
      entity_type: "challenge",
      entity_id: challengeId,
    });
  } catch (err) {
    console.error("[submitProblem] AI analysis failed:", err);
    // Non-fatal — challenge is already saved
  }

  revalidatePath("/problems");
  revalidatePath("/citizen");
  revalidatePath("/university");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  redirect(`/challenges/${challengeId}?submitted=1`);
}

// ---- Challenge lifecycle actions (admin/government) -------------------------

export async function validateChallenge(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await updateProblem(id, { status: "validated" });
  // Notify government/admin
  await addNotification({
    user_name: "Admin",
    user_role: "government",
    title: "Challenge validated",
    message: `Challenge ${id} has been validated and is ready for university assignment.`,
    type: "info",
    entity_type: "challenge",
    entity_id: id,
  });
  revalidatePath("/dashboard");
  revalidatePath("/problems");
}

export async function assignChallenge(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const university = String(formData.get("university") ?? "").trim();
  const category = String(formData.get("category") ?? "") as Category;
  if (!id) return;
  const assignedTo = university || routeToUniversity(category);
  await updateProblem(id, { status: "assigned", assigned_to: assignedTo });
  // Notify university and government
  await addNotification({
    user_name: assignedTo,
    user_role: "university",
    title: "New challenge assigned",
    message: `A new challenge has been assigned to ${assignedTo}. Please review and accept.`,
    type: "action",
    entity_type: "challenge",
    entity_id: id,
  });
  await addNotification({
    user_name: "Admin",
    user_role: "government",
    title: "Challenge assigned",
    message: `Challenge assigned to ${assignedTo}.`,
    type: "success",
    entity_type: "challenge",
    entity_id: id,
  });
  revalidatePath("/dashboard");
  revalidatePath("/problems");
  revalidatePath("/analytics");
}

// Legacy action kept for backward compat with existing dashboard buttons
export async function setStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ChallengeStatus;
  if (!id || !status) return;
  await updateProblem(id, { status });
  revalidatePath("/dashboard");
  revalidatePath("/problems");
  revalidatePath("/analytics");
}

export async function assignProblem(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const category = String(formData.get("category") ?? "") as Category;
  const state = String(formData.get("state") ?? "").trim() || undefined;
  const suggested = routeToUniversity(category, state);
  await updateProblem(id, { assigned_to: suggested, status: "assigned" });
  await addNotification({
    user_name: suggested,
    user_role: "university",
    title: "New challenge assigned",
    message: `A ${category} challenge has been auto-assigned to ${suggested}.`,
    type: "action",
    entity_type: "challenge",
    entity_id: id,
  });
  revalidatePath("/dashboard");
  revalidatePath("/problems");
  revalidatePath("/analytics");
}

// ---- Project actions (university) -------------------------------------------

export async function createProject(formData: FormData) {
  const challenge_id = String(formData.get("challenge_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const university_name = String(formData.get("university_name") ?? "").trim();
  const target_date = String(formData.get("target_date") ?? "").trim() || null;

  if (!challenge_id || !title || !university_name) return;

  const projectId = await addProject({
    challenge_id,
    title,
    description,
    university_name,
    university_id: null,
    industry_partner: null,
    status: "planning",
    progress: 0,
    start_date: new Date().toISOString(),
    target_date,
  });

  // Mark challenge as in_progress
  await updateProblem(challenge_id, { status: "in_progress" });

  // Notify government
  await addNotification({
    user_name: "Admin",
    user_role: "government",
    title: "Project started",
    message: `${university_name} has started project: ${title}.`,
    type: "success",
    entity_type: "project",
    entity_id: projectId,
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect(`/projects/${projectId}`);
}

export async function updateProjectStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ProjectStatus;
  const progress = Number(formData.get("progress") ?? 0);
  if (!id) return;
  await updateProject(id, { status, progress });
  revalidatePath(`/projects/${id}`);
  revalidatePath("/projects");
  revalidatePath("/analytics");
}

// ---- Milestone actions -------------------------------------------------------

export async function addMilestoneAction(formData: FormData) {
  const project_id = String(formData.get("project_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const deadline = String(formData.get("deadline") ?? "").trim() || null;
  const deliverable_url = String(formData.get("deliverable_url") ?? "").trim() || null;
  if (!project_id || !title) return;
  await addMilestone({
    project_id,
    title,
    description,
    deadline,
    deliverable_url,
    status: "pending",
    progress: 0,
  });
  revalidatePath(`/projects/${project_id}`);
}

export async function completeMilestoneAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const project_id = String(formData.get("project_id") ?? "");
  const deliverable_url = String(formData.get("deliverable_url") ?? "").trim() || null;
  if (!id) return;
  await updateMilestone(id, {
    status: "completed",
    progress: 100,
    completed_at: new Date().toISOString(),
    ...(deliverable_url ? { deliverable_url } : {}),
  });
  await addNotification({
    user_name: "Admin",
    user_role: "admin",
    title: "Milestone completed",
    message: `A project milestone has been completed.`,
    type: "success",
    entity_type: "milestone",
    entity_id: id,
  });
  revalidatePath(`/projects/${project_id}`);
}

// ---- Industry actions -------------------------------------------------------

export async function industryJoinProject(formData: FormData) {
  const project_id = String(formData.get("project_id") ?? "");
  const industry_name = String(formData.get("industry_name") ?? "").trim();
  const stakeholder_type = (String(formData.get("stakeholder_type") ?? "").trim() || null) as
    | "csr"
    | "msme"
    | "startup"
    | "psu"
    | "lab"
    | null;
  const contribution_types_raw = String(formData.get("contribution_types") ?? "");
  const description = String(formData.get("description") ?? "").trim() || null;
  const funding_amount_raw = String(formData.get("funding_amount") ?? "").trim();
  if (!project_id || !industry_name) return;

  const contribution_types = contribution_types_raw
    ? contribution_types_raw.split(",").map((s) => s.trim()).filter(Boolean)
    : ["mentorship"];
  const funding_amount = funding_amount_raw ? Number(funding_amount_raw) : null;

  await addIndustryParticipation({
    project_id,
    industry_name,
    stakeholder_type,
    contribution_types,
    description,
    funding_amount,
    status: "interested",
  });

  await updateProject(project_id, { industry_partner: industry_name });

  // Notify university and government
  await addNotification({
    user_name: "Admin",
    user_role: "university",
    title: "Industry partner joined",
    message: `${industry_name} has joined project ${project_id} as an industry partner.`,
    type: "success",
    entity_type: "project",
    entity_id: project_id,
  });
  await addNotification({
    user_name: "Admin",
    user_role: "government",
    title: "Industry participation",
    message: `${industry_name} is now participating in a project.`,
    type: "info",
    entity_type: "project",
    entity_id: project_id,
  });

  revalidatePath(`/projects/${project_id}`);
  revalidatePath("/industry");
  revalidatePath("/analytics");
  redirect(`/projects/${project_id}`);
}

// ---- Feedback ---------------------------------------------------------------

export async function submitFeedback(formData: FormData) {
  const challenge_id = String(formData.get("challenge_id") ?? "");
  const project_id = String(formData.get("project_id") ?? "").trim() || null;
  const submitter_name = String(formData.get("submitter_name") ?? "").trim() || "Anonymous";
  const rating = Number(formData.get("rating") ?? 3) as 1 | 2 | 3 | 4 | 5;
  const comment = String(formData.get("comment") ?? "").trim() || null;
  if (!challenge_id) return;
  await addFeedback({ challenge_id, project_id, submitter_name, rating, comment });
  revalidatePath(`/challenges/${challenge_id}`);
}

// ---- Impact metrics ---------------------------------------------------------

export async function recordImpact(formData: FormData) {
  const project_id = String(formData.get("project_id") ?? "");
  const people_impacted = Number(formData.get("people_impacted") ?? 0);
  const cost_saved = Number(formData.get("cost_saved") ?? 0) || null;
  const water_saved = Number(formData.get("water_saved") ?? 0) || null;
  const waste_reduced = Number(formData.get("waste_reduced") ?? 0) || null;
  const jobs_created = Number(formData.get("jobs_created") ?? 0) || null;
  const satisfaction_score = Number(formData.get("satisfaction_score") ?? 0) || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  if (!project_id) return;
  await addImpactMetric({ project_id, people_impacted, cost_saved, water_saved, waste_reduced, jobs_created, satisfaction_score, notes });
  // Mark project as completed if not already
  await updateProject(project_id, { status: "completed", progress: 100 });
  revalidatePath(`/projects/${project_id}`);
  revalidatePath("/analytics");
}

// ---- Notifications ----------------------------------------------------------

export async function markNotificationRead(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await dbMarkNotificationRead(id);
  revalidatePath("/notifications");
}

// ---- Re-analysis (explicit) -------------------------------------------------

export async function reanalyzeChallenge(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const state = String(formData.get("state") ?? "").trim() || undefined;
  const district = String(formData.get("district") ?? "").trim() || undefined;
  const local_area = String(formData.get("local_area") ?? formData.get("village_ward") ?? "").trim() || undefined;
  if (!id || !title) return;
  try {
    const existing = await getProblems();
    const analysis = await analyzeChallenge(
      title,
      description,
      existing.filter((p) => p.id !== id),
      state ? { state, district, local_area } : undefined
    );
    await saveAnalysis({ ...analysis, challenge_id: id });
    await updateProblem(id, {
      priority: analysis.priority,
      priority_score: analysis.priority_score,
      subcategory: analysis.subcategory,
    });
  } catch (err) {
    console.error("[reanalyzeChallenge] failed:", err);
  }
  revalidatePath(`/challenges/${id}`);
  revalidatePath("/dashboard");
}

// ---- University ranking (server action for client use) ----------------------

export async function getUniversityRankings(category: Category, disciplines: string[], state?: string) {
  return rankUniversities(category, disciplines, state);
}

// ---- University Challenge Actions -------------------------------------------

export async function acceptChallengeAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const university_name = String(formData.get("university_name") ?? "").trim();
  if (!id) return;
  await updateProblem(id, {
    status: "assigned",
    assigned_to: university_name || "Assigned University",
  });
  await addNotification({
    user_name: "Citizen",
    user_role: "citizen",
    title: "Challenge Accepted by University",
    message: `${university_name || "A university"} has accepted your challenge and will begin developing a solution.`,
    type: "success",
    entity_type: "challenge",
    entity_id: id,
  });
  await addNotification({
    user_name: "Admin",
    user_role: "government",
    title: "Challenge Accepted",
    message: `${university_name} accepted challenge ${id}.`,
    type: "info",
    entity_type: "challenge",
    entity_id: id,
  });
  revalidatePath(`/challenges/${id}`);
  revalidatePath("/university");
  revalidatePath("/dashboard");
  revalidatePath("/problems");
}

export async function rejectChallengeAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!id) return;
  await updateProblem(id, {
    status: "validated",
    assigned_to: null,
  });
  await addNotification({
    user_name: "Admin",
    user_role: "government",
    title: "Challenge Assignment Returned",
    message: `University declined challenge ${id}. Reason: ${reason || "Outside institutional scope"}. Returned to assignment pool.`,
    type: "warning",
    entity_type: "challenge",
    entity_id: id,
  });
  revalidatePath(`/challenges/${id}`);
  revalidatePath("/university");
  revalidatePath("/dashboard");
}

// ---- Multidisciplinary Team Actions ----------------------------------------

export async function addProjectMemberAction(formData: FormData) {
  const project_id = String(formData.get("project_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "student") as "faculty" | "student" | "mentor" | "industry" | "government";
  const department = String(formData.get("department") ?? "").trim() || null;
  const organisation = String(formData.get("organisation") ?? "").trim() || null;

  if (!project_id || !name) return;
  await addProjectMember({
    project_id,
    name,
    role,
    department,
    organisation,
  });
  revalidatePath(`/projects/${project_id}`);
}

export async function removeProjectMemberAction(formData: FormData) {
  const project_id = String(formData.get("project_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!project_id || !name) return;
  await removeProjectMember(project_id, name);
  revalidatePath(`/projects/${project_id}`);
}

// ---- Solution Proposal Actions ---------------------------------------------

export async function saveProjectProposalAction(formData: FormData) {
  const project_id = String(formData.get("project_id") ?? "");
  const problem_statement = String(formData.get("problem_statement") ?? "").trim();
  const proposed_solution = String(formData.get("proposed_solution") ?? "").trim();
  const technology = String(formData.get("technology") ?? "").trim();
  const implementation_plan = String(formData.get("implementation_plan") ?? "").trim();
  const expected_cost = Number(formData.get("expected_cost") ?? 0) || null;
  const expected_impact = String(formData.get("expected_impact") ?? "").trim();
  const scalability = String(formData.get("scalability") ?? "").trim();
  const sustainability = String(formData.get("sustainability") ?? "").trim();
  const status = (String(formData.get("status") ?? "draft") as ProposalStatus) || "draft";
  const document_url = String(formData.get("document_url") ?? "").trim() || null;

  if (!project_id || !problem_statement || !proposed_solution) return;

  await saveProjectProposal({
    project_id,
    problem_statement,
    proposed_solution,
    technology,
    implementation_plan,
    expected_cost,
    expected_impact,
    scalability,
    sustainability,
    status,
    document_url,
  });

  if (status === "submitted") {
    await addNotification({
      user_name: "Admin",
      user_role: "government",
      title: "New Solution Proposal Submitted",
      message: `A detailed solution proposal has been submitted for project ${project_id}.`,
      type: "action",
      entity_type: "project",
      entity_id: project_id,
    });
  }

  revalidatePath(`/projects/${project_id}`);
}

export async function updateProposalStatusAction(formData: FormData) {
  const project_id = String(formData.get("project_id") ?? "");
  const status = String(formData.get("status") ?? "under_review") as ProposalStatus;
  if (!project_id) return;
  await updateProposalStatus(project_id, status);
  revalidatePath(`/projects/${project_id}`);
}

// ---- Intellectual Property & Patents Action ---------------------------------
export async function addPatentAction(formData: FormData) {
  const project_id = String(formData.get("project_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const patent_number = String(formData.get("patent_number") ?? "").trim();
  const status = (String(formData.get("status") ?? "provisional_filed") as PatentRecord["status"]) || "provisional_filed";
  const filing_date = String(formData.get("filing_date") ?? "").trim() || new Date().toISOString();
  const inventorsStr = String(formData.get("inventors") ?? "").trim();
  const abstract = String(formData.get("abstract") ?? "").trim() || null;

  if (!project_id || !title || !patent_number) return;

  const inventors = inventorsStr
    ? inventorsStr.split(",").map((s) => s.trim()).filter(Boolean)
    : ["Project Research Team"];

  await addPatent({
    project_id,
    title,
    patent_number,
    status,
    filing_date,
    inventors,
    abstract,
  });

  await addNotification({
    user_name: "Admin",
    user_role: "government",
    title: "New Patent / IP Filed",
    message: `Patent application ${patent_number} ("${title}") logged under project ${project_id}.`,
    type: "success",
    entity_type: "project",
    entity_id: project_id,
  });

  revalidatePath(`/projects/${project_id}`);
  revalidatePath("/analytics");
}

// ---- Startup Incubation Action ----------------------------------------------
export async function addStartupAction(formData: FormData) {
  const project_id = String(formData.get("project_id") ?? "");
  const startup_name = String(formData.get("startup_name") ?? "").trim();
  const incubation_center = String(formData.get("incubation_center") ?? "").trim();
  const dpiit_number = String(formData.get("dpiit_number") ?? "").trim() || null;
  const funding_received = formData.get("funding_received") ? Number(formData.get("funding_received")) : null;
  const foundersStr = String(formData.get("founders") ?? "").trim();
  const status = (String(formData.get("status") ?? "incubated") as StartupIncubation["status"]) || "incubated";

  if (!project_id || !startup_name || !incubation_center) return;

  const founders = foundersStr
    ? foundersStr.split(",").map((s) => s.trim()).filter(Boolean)
    : ["Student Founder"];

  await addStartup({
    project_id,
    startup_name,
    incubation_center,
    dpiit_number,
    funding_received,
    founders,
    status,
  });

  await addNotification({
    user_name: "Admin",
    user_role: "government",
    title: "New Student Startup Incubated",
    message: `Startup "${startup_name}" incubated at ${incubation_center} from community challenge solution.`,
    type: "success",
    entity_type: "project",
    entity_id: project_id,
  });

  revalidatePath(`/projects/${project_id}`);
  revalidatePath("/analytics");
}

// ---- TRL Level Update Action ------------------------------------------------
export async function updateProjectTrlAction(formData: FormData) {
  const project_id = String(formData.get("project_id") ?? "");
  const trl = Number(formData.get("trl_level") ?? 1);
  if (!project_id || isNaN(trl)) return;

  await updateProjectTrl(project_id, Math.min(9, Math.max(1, trl)));
  revalidatePath(`/projects/${project_id}`);
  revalidatePath("/analytics");
}

// ---- Project Discussion / Mentorship Post Action ---------------------------
export async function addProjectDiscussionAction(formData: FormData) {
  const project_id = String(formData.get("project_id") ?? "");
  const author_name = String(formData.get("author_name") ?? "Contributor").trim();
  const author_role = (String(formData.get("author_role") ?? "faculty") as ProjectDiscussion["author_role"]) || "faculty";
  const message = String(formData.get("message") ?? "").trim();
  const message_type = (String(formData.get("message_type") ?? "update") as ProjectDiscussion["message_type"]) || "update";

  if (!project_id || !message) return;

  await addDiscussion({
    project_id,
    author_name,
    author_role,
    message,
    message_type,
  });

  revalidatePath(`/projects/${project_id}`);
}

// ---- Publish Deployed Solution to National Repository Action ----------------
export async function publishSolutionAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const problem_solved = String(formData.get("problem_solved") ?? "").trim();
  const domain = String(formData.get("domain") ?? "Water Resources") as Category;
  const state = String(formData.get("state") ?? "Jharkhand").trim();
  const district = String(formData.get("district") ?? "").trim();
  const institution = String(formData.get("institution") ?? "").trim();
  const technology = String(formData.get("technology") ?? "").trim();
  const project_stage = String(formData.get("project_stage") ?? "Deployed").trim();
  const deployment_status = String(formData.get("deployment_status") ?? "Operational in field").trim();
  const impact = String(formData.get("impact") ?? "").trim();
  const project_timeline = String(formData.get("project_timeline") ?? "6 Months").trim();

  if (!title || !problem_solved || !institution) return;

  await addSolution({
    title,
    problem_solved,
    domain,
    state,
    district: district || "District HQ",
    institution,
    technology: technology || "Societal Engineering Blueprint",
    project_stage,
    deployment_status,
    impact: impact || "Civic outcomes verified by local administration.",
    project_timeline,
  });

  revalidatePath("/solutions");
  revalidatePath("/analytics");
  revalidatePath("/");
}

