import { test } from 'node:test';
import assert from 'node:assert';

const API_URL = process.env.API_URL || 'http://localhost:80';

test('Health check endpoint should return OK', async () => {
  const response = await fetch(`${API_URL}/health`);
  const data = await response.json();
  
  assert.strictEqual(response.status, 200);
  assert.strictEqual(data.status, 'ok');
  assert.ok(data.timestamp);
});

test('GET /tasks should return tasks list', async () => {
  const response = await fetch(`${API_URL}/tasks`);
  const data = await response.json();
  
  assert.strictEqual(response.status, 200);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.pagination);
  assert.ok(typeof data.pagination.total === 'number');
});

test('POST /tasks should create a new task', async () => {
  const newTask = {
    title: 'Test Task',
    description: 'This is a test task',
  };

  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask),
  });

  const data = await response.json();
  
  assert.strictEqual(response.status, 201);
  assert.ok(data.data.id);
  assert.strictEqual(data.data.title, newTask.title);
  assert.strictEqual(data.data.status, 'pending');
});

test('POST /tasks without title should fail', async () => {
  const invalidTask = {
    description: 'Missing title',
  };

  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidTask),
  });

  assert.strictEqual(response.status, 400);
});

test('GET /tasks with status filter should work', async () => {
  const response = await fetch(`${API_URL}/tasks?status=pending`);
  const data = await response.json();
  
  assert.strictEqual(response.status, 200);
  assert.ok(Array.isArray(data.data));
  
  // All returned tasks should have status 'pending'
  data.data.forEach((task) => {
    assert.strictEqual(task.status, 'pending');
  });
});

test('GET /tasks/:id with invalid ID should return 404', async () => {
  const fakeId = '00000000-0000-0000-0000-000000000000';
  const response = await fetch(`${API_URL}/tasks/${fakeId}`);
  
  assert.strictEqual(response.status, 404);
});

test('DELETE /tasks/:id should delete task', async () => {
  // First, create a task
  const newTask = { title: 'Task to delete' };
  const createResponse = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask),
  });
  const { data: created } = await createResponse.json();

  // Then, delete it
  const deleteResponse = await fetch(`${API_URL}/tasks/${created.id}`, {
    method: 'DELETE',
  });

  assert.strictEqual(deleteResponse.status, 204);

  // Verify it's deleted
  const getResponse = await fetch(`${API_URL}/tasks/${created.id}`);
  assert.strictEqual(getResponse.status, 404);
});

