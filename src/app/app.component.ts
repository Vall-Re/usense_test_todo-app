import { Component, OnInit } from '@angular/core';
import { Todo } from './models/todo.model';
import { TodoService } from './services/todo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type FilterType = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle: string = '';
  newTodoPriority: 'low' | 'medium' | 'high' = 'medium'

  filter: FilterType = 'all';
  editingId: number | null = null;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data.map(todo => ({
        ...todo,
        priority: 'medium'
      }));

      this.sortTodos();
    });
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        title: this.newTodoTitle,
        completed: false,
        priority: this.newTodoPriority
      };

      this.todos.unshift(newTodo);
      this.sortTodos();
      this.newTodoTitle = '';
      this.newTodoPriority = 'medium';
    }
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  sortTodos(): void {
    const priorityOrder = {
      'high': 0,
      'medium': 1,
      'low': 2,
    };

    this.todos.sort((a, b) => {
      const aPriority = a.priority ?? 'medium';
      const bPriority = b.priority ?? 'medium';

      return priorityOrder[aPriority] - priorityOrder[bPriority];
    });
  }

  get filteredTodos(): Todo[] {
    if (this.filter === 'active') {
      return this.todos.filter(t => !t.completed);

    }
    if (this.filter === 'completed') {
      return this.todos.filter(t => t.completed);
    }
    return this.todos;
  }

  startEdit(todo: Todo): void {
    if (todo.completed) {
      return;
    }
    
    this.editingId = todo.id;
  }

  saveEdit(todo: Todo): void {
    this.editingId = null;
    if (!todo.title.trim()) {
      this.deleteTodo(todo.id);
    }
  }

  cancelEdit(todo: Todo): void {
    this.editingId = null;
  }

}
