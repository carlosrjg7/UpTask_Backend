import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    console.log(req.body);

    const project = new Project(req.body);

    try {
      await project.save();
      res.send("Proyecto creado con éxito...");
    } catch (error) {
      console.error("Error creando proyecto:", error);
      return res.status(500).send("Error creando proyecto");
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      return res.status(500).send("Error fetching projects");
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    console.log(req.params.id);
    try {
      const project = await Project.findById(req.params.id).populate("tasks");
      if (!project) {
        return res.status(404).send("Project not found");
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching projects:", error);
      return res.status(500).send("Error fetching projects");
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    console.log(req.params.id);
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).send("Project not found");
      }
      project.clientName = req.body.clientName || project.clientName;
      project.projectName = req.body.projectName || project.projectName;
      project.description = req.body.description || project.description;

      await project.save();
      res.send("Proyecto actualizado con éxito...");
    } catch (error) {
      console.error("Error fetching projects:", error);
      return res.status(500).send("Error fetching projects");
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    console.log(req.params.id);
    try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) {
        return res.status(404).send("Project not found");
      }
      res.send("Proyecto eliminado con éxito...");
    } catch (error) {
      console.error("Error fetching projects:", error);
      return res.status(500).send("Error fetching projects");
    }
  };
}
