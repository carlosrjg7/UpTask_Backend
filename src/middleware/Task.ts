import type { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export async function validateTaskExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    req.task = task;
    next();
  } catch (error) {
    console.error(`Error al validar la tarea: ${error}`);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export function taskBelongsToProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.task.project.toString() !== req.project.id.toString()) {
      return res
        .status(403)
        .json({ error: "No autorizado para ver esta tarea" });
    }
    next();
  } catch (error) {
    console.error(`Error al validar la tarea: ${error}`);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
