using System.ComponentModel.DataAnnotations;

namespace TaskManager.API.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;
        
        public bool IsCompleted { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? CompletedAt { get; set; }
        
        public DateTime? DueDate { get; set; }
        
        public int Priority { get; set; } = 1; // 1 = Low, 2 = Medium, 3 = High
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        public User User { get; set; } = null!;
        
        public int? CategoryId { get; set; }
        
        public Category? Category { get; set; }
    }
}