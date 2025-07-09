import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { Task, TaskPriority, TaskStatus, CreateTaskRequest } from '../models/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container fade-in">
      <!-- Navigation -->
      <nav class="nav">
        <div class="nav-content">
          <div class="nav-brand">Task Manager</div>
          <ul class="nav-links">
            <li><a href="#" class="nav-link" (click)="navigateToDashboard($event)">Dashboard</a></li>
            <li><a href="#" class="nav-link active">Tasks</a></li>
            <li><a href="#" class="nav-link" (click)="logout($event)">Logout</a></li>
          </ul>
        </div>
      </nav>

      <!-- Page Header -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="margin-bottom: 0.5rem;">Task Management</h1>
            <p style="color: #666; margin: 0;">Manage and track all your tasks</p>
          </div>
          <button class="btn" (click)="showCreateForm = !showCreateForm">
            {{ showCreateForm ? 'Cancel' : 'Create New Task' }}
          </button>
        </div>
      </div>

      <!-- Create Task Form -->
      <div class="card" *ngIf="showCreateForm">
        <h2 style="margin-bottom: 1.5rem;">Create New Task</h2>
        
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Title</label>
              <input 
                type="text" 
                class="form-control" 
                formControlName="title"
                placeholder="Enter task title"
              >
            </div>

            <div class="form-group">
              <label class="form-label">Priority</label>
              <select class="form-control" formControlName="priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea 
              class="form-control" 
              formControlName="description"
              placeholder="Enter task description"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Due Date</label>
            <input 
              type="date" 
              class="form-control" 
              formControlName="dueDate"
            >
          </div>

          <div style="display: flex; gap: 1rem;">
            <button 
              type="submit" 
              class="btn"
              [disabled]="taskForm.invalid || isCreating"
            >
              {{ isCreating ? 'Creating...' : 'Create Task' }}
            </button>
            <button 
              type="button" 
              class="btn btn-secondary"
              (click)="showCreateForm = false"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Tasks List -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <h2>All Tasks ({{ filteredTasks.length }})</h2>
          
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <select (change)="filterByStatus($event)" class="form-control" style="width: auto;">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            
            <select (change)="filterByPriority($event)" class="form-control" style="width: auto;">
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div *ngIf="isLoading" class="loading">
          Loading tasks...
        </div>

        <div *ngIf="!isLoading && filteredTasks.length === 0" style="text-align: center; color: #666; padding: 2rem;">
          {{ tasks.length === 0 ? 'No tasks found. Create your first task!' : 'No tasks match the current filters.' }}
        </div>

        <div class="task-grid" *ngIf="!isLoading && filteredTasks.length > 0">
          <div 
            *ngFor="let task of filteredTasks" 
            class="task-item"
            [class.completed]="task.status === 'completed'"
            [class.high-priority]="task.priority === 'high'"
          >
            <h3 class="task-title">{{ task.title }}</h3>
            <p class="task-description">{{ task.description }}</p>
            
            <div style="margin: 1rem 0; font-size: 0.9rem;">
              <div><strong>Status:</strong> {{ getStatusLabel(task.status) }}</div>
              <div *ngIf="task.dueDate"><strong>Due:</strong> {{ task.dueDate | date:'short' }}</div>
              <div><strong>Created:</strong> {{ task.createdDate | date:'short' }}</div>
            </div>
            
            <div class="task-meta">
              <span 
                class="priority-badge"
                [class.priority-high]="task.priority === 'high'"
                [class.priority-medium]="task.priority === 'medium'"
                [class.priority-low]="task.priority === 'low'"
              >
                {{ task.priority }}
              </span>
              
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button 
                  class="btn btn-success"
                  *ngIf="task.status !== 'completed'"
                  (click)="markAsCompleted(task)"
                  style="padding: 0.25rem 0.75rem; font-size: 0.8rem;"
                >
                  Complete
                </button>
                <button 
                  class="btn btn-secondary"
                  *ngIf="task.status === 'pending'"
                  (click)="markAsInProgress(task)"
                  style="padding: 0.25rem 0.75rem; font-size: 0.8rem;"
                >
                  Start
                </button>
                <button 
                  class="btn btn-danger"
                  (click)="deleteTask(task.id)"
                  style="padding: 0.25rem 0.75rem; font-size: 0.8rem;"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  isLoading = true;
  showCreateForm = false;
  isCreating = false;
  taskForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: [TaskPriority.Medium, Validators.required],
      dueDate: ['']
    });
  }

  ngOnInit() {
    this.loadTasks();
  }

  private loadTasks() {
    this.isLoading = true;
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.filteredTasks = tasks;
      this.isLoading = false;
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.isCreating = true;
      const taskData: CreateTaskRequest = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        priority: this.taskForm.value.priority,
        dueDate: this.taskForm.value.dueDate ? new Date(this.taskForm.value.dueDate) : undefined
      };

      this.taskService.createTask(taskData).subscribe(() => {
        this.isCreating = false;
        this.showCreateForm = false;
        this.taskForm.reset({
          priority: TaskPriority.Medium
        });
        this.loadTasks();
      });
    }
  }

  markAsCompleted(task: Task) {
    this.taskService.updateTask({
      id: task.id,
      status: TaskStatus.Completed
    }).subscribe(() => {
      this.loadTasks();
    });
  }

  markAsInProgress(task: Task) {
    this.taskService.updateTask({
      id: task.id,
      status: TaskStatus.InProgress
    }).subscribe(() => {
      this.loadTasks();
    });
  }

  deleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  filterByStatus(event: any) {
    const status = event.target.value;
    this.applyFilters(status, null);
  }

  filterByPriority(event: any) {
    const priority = event.target.value;
    this.applyFilters(null, priority);
  }

  private applyFilters(status: string | null, priority: string | null) {
    this.filteredTasks = this.tasks.filter(task => {
      const statusMatch = !status || task.status === status;
      const priorityMatch = !priority || task.priority === priority;
      return statusMatch && priorityMatch;
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }

  navigateToDashboard(event: Event) {
    event.preventDefault();
    this.router.navigate(['/dashboard']);
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}