using System.ComponentModel.DataAnnotations;

namespace TaskManager.API.Models
{
    public class Category
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(7)]
        public string Color { get; set; } = "#007bff";
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        public User User { get; set; } = null!;
        
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}