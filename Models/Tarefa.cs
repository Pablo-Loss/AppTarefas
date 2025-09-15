namespace app_tarefas.Models;

public class Tarefa
{

    public Tarefa(string description)
    {
        Description = description;
        CompletionDate = null;
    }

    public int Id { get; set; }
    public string Description { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? CompletionDate { get; set; }
}