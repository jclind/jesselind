import { projects } from '../assets/data/projects'

export const getNextProjectLink = (projectId: number) => {
  const currentProject = projects.find(project => project.id === projectId)
  const nextProjectId = ++projectId
  const nextProject = projects.find(project => project.id === nextProjectId)

  if (nextProject && nextProject.slug) return `/projects/${nextProject.slug}`
  return null
}
