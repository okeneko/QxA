using System;

namespace QxA.Api.Models
{
    public class QuestionAnswerDTO
    {
        public string Id { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public DateTime Asked { get; set; }
        public DateTime Answered { get; set; }

        public UserDTO Owner { get; set; }
        public UserDTO Asker { get; set; }
    }
}
