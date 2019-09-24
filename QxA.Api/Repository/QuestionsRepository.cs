using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QxA.Api.Exceptions;
using QxA.Api.Models;
using QxA.Infrastructure.Data;

namespace QxA.Api.Repository
{
    public class QuestionsRepository : IQuestionsRepository
    {
        private ApplicationDbContext _context;
        private UserManager<User> _userManager;
        private IMapper _mapper;

        public QuestionsRepository(ApplicationDbContext context, UserManager<User> userManager, IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<QuestionAnswerDTO> GetQuestion(string id)
        {
            QuestionAnswer question = await _context.Questions
                .Include(q => q.Owner)
                .Include(q => q.Asker)
                .SingleAsync(q => q.Id == id);

            return _mapper.Map<QuestionAnswerDTO>(question);
        }

        public async Task<List<QuestionAnswerDTO>> GetUnansweredQuestions(string username)
        {
            List<QuestionAnswer> questions = await _context.Questions
                .Include(q => q.Owner)
                .Include(q => q.Asker)
                .Where(q => q.Owner.UserName == username)
                .Where(q => String.IsNullOrEmpty(q.Answer))
                .ToListAsync();

            return _mapper.Map<List<QuestionAnswerDTO>>(questions);
        }

        public async Task<List<QuestionAnswerDTO>> GetAnsweredQuestions(string username)
        {
            List<QuestionAnswer> questions = await _context.Questions
                .Include(q => q.Owner)
                .Include(q => q.Asker)
                .Where(q => q.Owner.UserName == username)
                .Where(q => !String.IsNullOrEmpty(q.Answer))
                .ToListAsync();

            return _mapper.Map<List<QuestionAnswerDTO>>(questions);
        }

        public async Task AskQuestion(QuestionDTO question)
        {
            User owner = await _userManager.FindByNameAsync(question.OwnerUserName);
            User asker = await _userManager.FindByNameAsync(question.AskerUserName);

            QuestionAnswer newQuestion = new QuestionAnswer
            {
                Question = question.Question,
                Owner = owner,
                Asker = asker
            };

            await _context.Questions.AddAsync(newQuestion);
            await _context.SaveChangesAsync();
        }

        public async Task AnswerQuestion(string id, string answer)
        {
            QuestionAnswer question = await _context.Questions.FindAsync(id);

            if (question == null)
                throw new QuestionNotFoundException();

            question.Answer = answer;
            question.Answered = DateTime.Now;
            _context.Questions.Update(question);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAnswer(string id)
        {
            QuestionAnswer question = await _context.Questions.FindAsync(id);

            if (question == null)
                throw new QuestionNotFoundException();

            question.Answer = null;
            question.Answered = DateTime.MinValue;
            _context.Questions.Update(question);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteQuestion(string id)
        {
            QuestionAnswer question = await _context.Questions.FindAsync(id);

            if (question == null)
                throw new QuestionNotFoundException();

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
        }


    }
}
