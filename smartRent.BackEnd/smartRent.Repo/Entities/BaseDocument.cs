namespace smartRent.Repo.Entities
{
    public abstract class BaseDocument : BaseEntity
    {
        public string Name { get; set; }
        public string Title { get; set; }
    }
}