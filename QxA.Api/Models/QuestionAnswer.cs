using System;
using System.ComponentModel.DataAnnotations;

namespace QxA.Api.Models
{
    public class QuestionAnswer
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string Question { get; set; }
        public string Answer { get; set; }
        public DateTime Asked { get; set; }
        public DateTime Answered { get; set; }

        [Required]
        public User Owner { get; set; }
        public User Asker { get; set; }
    }
}
