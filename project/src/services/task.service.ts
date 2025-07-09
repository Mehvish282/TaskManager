import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatistics } from '../models/task.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl)
      .pipe(
        map(tasks => tasks.map(this.mapTaskFromApi)),
        tap(tasks => this.tasksSubject.next(tasks))
      );
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`)
      .pipe(map(this.mapTaskFromApi));
  }

  createTask(taskData: CreateTaskRequest): Observable<Task> {
    const apiTask = {
      title: taskData.title,
      description: taskData.description,
      priority: this.mapPriorityToApi(taskData.priority),
      dueDate: taskData.dueDate?.toISOString(),
      assigneeId: taskData.assigneeId,
      categoryId: taskData.categoryId
    };

    return this.http.post<Task>(this.apiUrl, apiTask)
      .pipe(
        map(this.mapTaskFromApi),
        tap(() => this.refreshTasks())
      );
  }

  updateTask(taskData: UpdateTaskRequest): Observable<Task> {
    const apiTask: any = {};
    
    if (taskData.title) apiTask.title = taskData.title;
    if (taskData.description) apiTask.description = taskData.description;
    if (taskData.priority) apiTask.priority = this.mapPriorityToApi(taskData.priority);
    if (taskData.status) apiTask.status = this.mapStatusToApi(taskData.status);
    if (taskData.dueDate) apiTask.dueDate = taskData.dueDate.toISOString();
    if (taskData.assigneeId) apiTask.assigneeId = taskData.assigneeId;
    if (taskData.categoryId) apiTask.categoryId = taskData.categoryId;

    return this.http.put<Task>(`${this.apiUrl}/${taskData.id}`, apiTask)
      .pipe(
        map(this.mapTaskFromApi),
        tap(() => this.refreshTasks())
      );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.refreshTasks()));
  }

  getStatistics(): Observable<TaskStatistics> {
    return this.http.get<TaskStatistics>(`${this.apiUrl}/statistics`);
  }

  private refreshTasks(): void {
    this.getTasks().subscribe();
  }

  private mapTaskFromApi = (apiTask: any): Task => {
    return {
      id: apiTask.id,
      title: apiTask.title,
      description: apiTask.description,
      priority: apiTask.priority,
      status: apiTask.status,
      createdDate: new Date(apiTask.createdDate),
      dueDate: apiTask.dueDate ? new Date(apiTask.dueDate) : undefined,
      assigneeId: apiTask.assigneeId,
      categoryId: apiTask.categoryId
    };
  };

  private mapPriorityToApi(priority: string): number {
    switch (priority.toLowerCase()) {
      case 'low': return 0;
      case 'medium': return 1;
      case 'high': return 2;
      default: return 1;
    }
  }

  private mapStatusToApi(status: string): number {
    switch (status.toLowerCase()) {
      case 'pending': return 0;
      case 'in-progress': return 1;
      case 'completed': return 2;
      case 'cancelled': return 3;
      default: return 0;
    }
  }
}