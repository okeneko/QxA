using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QxA.Api.Exceptions;
using QxA.Api.Models;
using QxA.Api.Repository;
using QxA.Api.Services;

namespace QxA.Api.Controllers
{
    [Authorize]
    [Route("api")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {

        private readonly IQuestionsRepository _repository;
        private readonly IAuthService _authService;
        public QuestionsController(IQuestionsRepository repository, IAuthService authService)
        {
            _repository = repository;
            _authService = authService;
        }

        [HttpGet("question/{id}")]
        public async Task<IActionResult> GetQuestion(string id)
        {
            QuestionAnswerDTO question = await _repository.GetQuestion(id);

            if (question == null)
                return NotFound(new { error = "The question does not exist." });

            string username = question.Owner.UserName;
            if (!_authService.AuthorizeUsernameWithToken(Request.Headers["Authorization"][0], username))
                return Unauthorized(new { error = "Unauthorized." });
            
            return Ok(question);
        }

        [HttpGet("questions/{username}")]
        public async Task<IActionResult> GetUnansweredQuestions(string username)
        {
            if (!_authService.AuthorizeUsernameWithToken(Request.Headers["Authorization"][0], username))
                return Unauthorized(new { error = "Unauthorized." });

            return Ok(await _repository.GetUnansweredQuestions(username));
        }

        [AllowAnonymous]
        [HttpGet("answers/{username}")]
        public async Task<IActionResult> GetAnsweredQuestions(string username)
        {
            return Ok(await _repository.GetAnsweredQuestions(username));
        }

        [HttpPost("question")]
        public async Task<ActionResult> AskQuestion([FromBody]QuestionDTO question)
        {
            try
            {
                await _repository.AskQuestion(question);
                return Ok(new { success = "The question was successfully submitted." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("answer/{id}")]
        public async Task<IActionResult> AnswerQuestion(string id, [FromBody]AnswerDTO answer)
        {
            try
            {
                await _repository.AnswerQuestion(id, answer.Answer);
                return Ok(new { success = "The question was successfully answered." });
            }
            catch (QuestionNotFoundException)
            {
                return NotFound(new { error = "The question does not exist." });
            }
            catch (Exception)
            {
                return BadRequest(new { error = "The question could not be answered." });
            }
        }

        [HttpDelete("answer/{id}")]
        public async Task<IActionResult> DeleteAnswer(string id)
        {
            try
            {
                await _repository.DeleteAnswer(id);
                return Ok(new { success = "The answer was successfully deleted." });
            }
            catch (QuestionNotFoundException)
            {
                return NotFound(new { error = "The question does not exist." });
            }
            catch (Exception)
            {
                return BadRequest(new { error = "The answer could not be deleted." });
            }
        }

        [HttpDelete("question/{id}")]
        public async Task<IActionResult> DeleteQuestion(string id)
        {
            try
            {
                await _repository.DeleteQuestion(id);
                return Ok(new { success = "The question was successfully deleted." });
            }
            catch (QuestionNotFoundException)
            {
                return NotFound(new { error = "The question does not exist." });
            }
            catch (Exception)
            {
                return BadRequest(new { error = "The question could not be deleted." });
            }
        }

        


    }
}