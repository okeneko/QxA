using QxA.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QxA.Api.Repository
{
    public interface IQuestionsRepository
    {
        Task<QuestionAnswerDTO> GetQuestion(string id);
        Task<List<QuestionAnswerDTO>> GetUnansweredQuestions(string username);
        Task<List<QuestionAnswerDTO>> GetAnsweredQuestions(string username);

        Task AskQuestion(QuestionDTO question);
        Task AnswerQuestion(string id, string answer);
        Task DeleteAnswer(string id);
        Task DeleteQuestion(string id);
    }
}
