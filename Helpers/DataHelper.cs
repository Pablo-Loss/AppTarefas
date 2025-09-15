namespace app_tarefas.Helpers;

public class DataHelper
{
    public static DateTime RoundToMinute(DateTime dt)
    {
        return new DateTime(dt.Year, dt.Month, dt.Day, dt.Hour, dt.Minute, 0);
    }
}