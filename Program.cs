using app_tarefas.Data;
using app_tarefas.Helpers;
using app_tarefas.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=tarefas.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://127.0.0.1:5500")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.MapGet("/tarefas", async (AppDbContext db) =>
{
    try
    {
        var tarefas = await db.Tarefas.ToListAsync();
        return Results.Ok(tarefas);   
    }
    catch (Exception)
    {
        return Results.InternalServerError();
    }
});

app.MapPost("/tarefas", async (Tarefa tarefa, AppDbContext db) =>
{
    try
    {
        tarefa.CreatedDate = DataHelper.RoundToMinute(DateTime.Now);
        db.Tarefas.Add(tarefa);
        await db.SaveChangesAsync();
        return Results.Ok();
    }
    catch (Exception)
    {
        return Results.StatusCode(500);
    }
});

app.MapPatch("/tarefas/{id}/concluir", async (int id, AppDbContext db) =>
{
    try
    {
        var tarefa = await db.Tarefas.FindAsync(id);
        if (tarefa == null) return Results.NotFound();
        tarefa.CompletionDate = DataHelper.RoundToMinute(DateTime.Now);
        await db.SaveChangesAsync();
        return Results.Ok(tarefa);
    }
    catch (Exception)
    {
        return Results.StatusCode(500);
    }
});

app.MapPut("/tarefas/{id}", async (int id, Tarefa tarefaEdit, AppDbContext db) =>
{
    var tarefa = await db.Tarefas.FindAsync(id);
    if (tarefa == null) return Results.NotFound();

    tarefa.Description = tarefaEdit.Description;
    if (tarefaEdit.CompletionDate != null)
        tarefa.CompletionDate = tarefaEdit.CompletionDate;

    await db.SaveChangesAsync();
    return Results.Ok(tarefa);
});

app.MapDelete("tarefas/{id}", async (int id, AppDbContext db) =>
{
    try
    {
        var tarefa = await db.Tarefas.FindAsync(id);
        if (tarefa == null) return Results.NotFound();

        db.Tarefas.Remove(tarefa);
        await db.SaveChangesAsync();
        return Results.Ok();
    }
    catch (Exception)
    {
        return Results.StatusCode(500);
    }
});

app.Run();