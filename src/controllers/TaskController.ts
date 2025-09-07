import type { Request, Response } from "express";
import Project from "../models/Project";
import Task from "../models/Task";

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      task.project = req.project.id; // Usar el proyecto validado en el middleware
      req.project.tasks.push(task.id);
      await Promise.allSettled([task.save(), req.project.save()]);
      res.send("Tarea creada con éxito...");
    } catch (error) {
      console.error(`Error al crear la tarea: ${error}`);
      res.status(500).json({ error: "Error al crear la tarea" });
    }
  };

  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate(
        "project"
      );
      res.json(tasks);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al consultar las tareas" });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      res.json(req.task);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al consultar la tarea" });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      req.task.name = req.body.name || req.task.name;
      req.task.description = req.body.description || req.task.description;

      await req.task.save();

      res.send("Tarea actualizada con éxito...");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al actualizar la tarea" });
    }
  };

  static deleteTask = async (req: Request, res: Response) => {
    try {
      req.project.tasks = req.project.tasks.filter(
        (t) => t.toString() !== req.task.id
      );

      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);

      res.send("Tarea eliminada con éxito...");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al eliminar la tarea" });
    }
  };

  static updateTaskStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      req.task.status = status;

      await req.task.save();

      res.send("Estado de la tarea actualizado con éxito...");
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Error al actualizar el estado de la tarea" });
    }
  };
}
