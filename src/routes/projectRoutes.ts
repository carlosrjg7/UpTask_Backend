import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import Task from "../models/Task";
import { validateProjectExists } from "../middleware/project";
import { taskBelongsToProject, validateTaskExists } from "../middleware/Task";

const router = Router();

router.post(
  "/",
  body("clientName")
    .notEmpty()
    .withMessage("El Nombre del cliente es obligatorio"),
  body("projectName")
    .notEmpty()
    .withMessage("El Nombre del proyecto es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción del proyecto es obligatoria"),
  handleInputErrors,
  ProjectController.createProject
);

router.get("/", ProjectController.getAllProjects);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID no valido!"),
  handleInputErrors,
  ProjectController.getProjectById
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("ID no valido!"),
  body("clientName")
    .notEmpty()
    .withMessage("El Nombre del cliente es obligatorio"),
  body("projectName")
    .notEmpty()
    .withMessage("El Nombre del proyecto es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción del proyecto es obligatoria"),
  handleInputErrors,
  ProjectController.updateProject
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("ID no valido!"),
  handleInputErrors,
  ProjectController.deleteProject
);

/** Rutas para las tareas de proyectos **/
router.param("projectId", validateProjectExists);
router.post(
  "/:projectId/tasks",
  body("name").notEmpty().withMessage("El Nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción de la tarea es obligatoria"),
  TaskController.createTask
);

router.get("/:projectId/tasks", TaskController.getProjectTasks);

router.param("taskId", validateTaskExists);
router.param("taskId", taskBelongsToProject);

router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no valido!"),
  body("name").notEmpty().withMessage("El Nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción de la tarea es obligatoria"),
  handleInputErrors,
  TaskController.getTaskById
);

router.put(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no valido!"),
  handleInputErrors,
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no valido!"),
  handleInputErrors,
  TaskController.deleteTask
);

router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("ID no valido!"),
  body("status").notEmpty().withMessage("El estado es obligatorio"),
  handleInputErrors,
  TaskController.updateTaskStatus
);

export default router;
