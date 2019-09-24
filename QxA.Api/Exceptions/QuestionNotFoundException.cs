using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QxA.Api.Exceptions
{
    public class QuestionNotFoundException : Exception
    {
        public QuestionNotFoundException()
        {

        }

        public QuestionNotFoundException(string message) : base(message)
        {

        }
    }
}
