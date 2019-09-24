using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace QxA.Api.Models
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        //public List<QuestionAnswer> Questions { get; set; }
    }
}
