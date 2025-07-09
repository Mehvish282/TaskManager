import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { Task, TaskStatistics, TaskStatus, TaskPriority } from '../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container fade-in">
      <!-- Navigation -->
      <nav class="nav">
        <div class="nav-content">
          <div class="nav-brand">Task Manager</div>
          <ul class="nav-links">
            <li><a href="#" class="nav-link active">Dashboard</a></li>
            <li><a href="#" class="nav-link" (click)="navigateToTasks($event)">Tasks</a></li>
            <li><a href="#" class="nav-link" (click)="logout($event)">Logout</a></li>
          </ul>
        </div>
      </nav>

      <!-- Welcome Section -->
      <div class="card">
        <h1>Welcome back, {{ currentUser?.firstName }}!</h1>
        <p style="color: #666; margin-top: 0.5rem;">Here's an overview of your task management system</p>
      </div>

      <!-- Statistics -->
      <div class="stats-grid" *ngIf="statistics">
        <div class="stat-card">
          <div class="stat-number">{{ statistics.totalTasks }}</div>
          <div class="stat-label">Total Tasks</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ statistics.completedTasks }}</div>
          <div class="stat-label">Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ statistics.pendingTasks }}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ statistics.highPriorityTasks }}</div>
          <div class="stat-label">High Priority</div>
        </div>
      </div>

      <!-- Recent Tasks -->
      <div class="card">
        <h2 style="margin-bottom: 1.5rem;">Recent Tasks</h2>
        
        <div *ngIf="isLoading" class="loading">
          Loading tasks...
        </div>

        <div *ngIf="!isLoading && tasks.length === 0" style="text-align: center; color: #666; padding: 2rem;">
          No tasks found. Create your first task to get started!
        </div>

        <div class="task-grid" *ngIf="!isLoading && tasks.length > 0">
          <div 
            *ngFor="let task of tasks" 
            class="task-item"
            [class.completed]="task.status === 'completed'"
            [class.high-priority]="task.priority === 'high'"
          >
            <h3 class="task-title">{{ task.title }}</h3>
            <p class="task-description">{{ task.description }}</p>
            
            <div class="task-meta">
              <span 
                class="priority-badge"
                [class.priority-high]="task.priority === 'high'"
                [class.priority-medium]="task.priority === 'medium'"
                [class.priority-low]="task.priority === 'low'"
              >
                {{ task.priority }}
              </span>
              
              <div style="display: flex; gap: 0.5rem;">
                <button 
                  class="btn btn-success"
                  *ngIf="task.status !== 'completed'"
                  (click)="markAsCompleted(task)"
                  style="padding: 0.25rem 0.75rem; font-size: 0.8rem;"
                >
                  Complete
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

        <div style="text-align: center; margin-top: 2rem;">
          <button class="btn" (click)="navigateToTasks($event)">
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  statistics: TaskStatistics | null = null;
  isLoading = true;
  currentUser = this.authService.getCurrentUser();

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.isLoading = true;

    // Load statistics
    this.taskService.getStatistics().subscribe(stats => {
      this.statistics = stats;
    });

    // Load recent tasks
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks.slice(0, 6); // Show only first 6 tasks
      this.isLoading = false;
    });
  }

  markAsCompleted(task: Task) {
    this.taskService.updateTask({
      id: task.id,
      status: TaskStatus.Completed
    }).subscribe(() => {
      this.loadDashboardData();
    });
  }

  deleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe(() => {
        this.loadDashboardData();
      });
    }
  }

  navigateToTasks(event: Event) {
    event.preventDefault();
    this.router.navigate(['/tasks']);
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}