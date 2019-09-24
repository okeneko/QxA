using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using QxA.Api.Controllers;
using QxA.Api.Exceptions;
using QxA.Api.Models;
using QxA.Api.Repository;
using QxA.Api.Services;
using System;
using System.Collections.Generic;
using Xunit;

namespace QxA.Test
{
    public class QuestionAnswerTests
    {
        private readonly Mock<IQuestionsRepository> _mockRepo;
        private readonly Mock<IAuthService> _mockAuth;
        private readonly QuestionsController _controller;

        private readonly QuestionAnswerDTO testQuestion = new QuestionAnswerDTO
        {
            Id = "ID",
            Question = "Test Question",
            Answer = "Test Answer",
            Asker = new UserDTO
            {
                UserName = "TestAsker",
                FirstName = "Asker",
                LastName = "Test"
            },
            Owner = new UserDTO
            {
                UserName = "TestOwner",
                FirstName = "Owner",
                LastName = "Test"
            }
        };

        public QuestionAnswerTests()
        {
            _mockRepo = new Mock<IQuestionsRepository>();
            _mockAuth = new Mock<IAuthService>();

            // Set the fake HttpContext so the Request.Headers 
            // accessed in the controller by the test isn't null
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "FakeJWTToken";
            var controllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            };

            _controller = new QuestionsController(_mockRepo.Object, _mockAuth.Object)
            {
                ControllerContext = controllerContext
            };
        }

        #region GetQuestion

        [Fact]
        public async void GetQuestion_NullQuestion_ReturnsNotFound()
        {
            _mockRepo.Setup(x => x.GetQuestion(It.IsAny<string>()))
                .ReturnsAsync(null as QuestionAnswerDTO);
            _mockAuth.Setup(x => x.AuthorizeUsernameWithToken(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(true);

            var result = await _controller.GetQuestion(It.IsAny<string>());

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async void GetQuestion_ValidQuestion_ReturnsUnauthorized()
        {
            _mockRepo.Setup(x => x.GetQuestion(It.IsAny<string>()))
                .ReturnsAsync(testQuestion);
            _mockAuth.Setup(x => x.AuthorizeUsernameWithToken(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(false);

            var result = await _controller.GetQuestion(It.IsAny<string>());

            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async void GetQuestion_ValidQuestion_ReturnsOk()
        {
            _mockRepo.Setup(x => x.GetQuestion(It.IsAny<string>()))
                .ReturnsAsync(testQuestion);
            _mockAuth.Setup(x => x.AuthorizeUsernameWithToken(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(true);

            var result = await _controller.GetQuestion(It.IsAny<string>());

            Assert.IsType<OkObjectResult>(result);
        }

        #endregion

        #region GetUnansweredQuestions

        [Fact]
        public async void GetUnansweredQuestions_ReturnsUnauthorized()
        {
            _mockRepo.Setup(x => x.GetUnansweredQuestions(It.IsAny<string>()))
                .ReturnsAsync(new List<QuestionAnswerDTO> { testQuestion, testQuestion});
            _mockAuth.Setup(x => x.AuthorizeUsernameWithToken(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(false);

            var result = await _controller.GetUnansweredQuestions(It.IsAny<string>());

            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async void GetUnansweredQuestions_ReturnsOk()
        {
            _mockRepo.Setup(x => x.GetUnansweredQuestions(It.IsAny<string>()))
                .ReturnsAsync(new List<QuestionAnswerDTO> { testQuestion, testQuestion});
            _mockAuth.Setup(x => x.AuthorizeUsernameWithToken(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(true);

            var result = await _controller.GetUnansweredQuestions(It.IsAny<string>());

            Assert.IsType<OkObjectResult>(result);
        }

        #endregion

        #region GetAnsweredQuestions

        [Fact]
        public async void GetAnsweredQuestions_ReturnsOk()
        {
            _mockRepo.Setup(x => x.GetUnansweredQuestions(It.IsAny<string>()))
                .ReturnsAsync(new List<QuestionAnswerDTO> { testQuestion, testQuestion});

            var result = await _controller.GetAnsweredQuestions(It.IsAny<string>());

            Assert.IsType<OkObjectResult>(result);
        }

        #endregion

        #region AskQuestion

        [Fact]
        public async void AskQuestion_ReturnsBadRequest()
        {
            _mockRepo.Setup(x => x.AskQuestion(It.IsAny<QuestionDTO>())).Throws(new Exception());

            var result = await _controller.AskQuestion(It.IsAny<QuestionDTO>());

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async void AskQuestion_ReturnsOk()
        {
            _mockRepo.Setup(x => x.AskQuestion(It.IsAny<QuestionDTO>())).Verifiable();

            var result = await _controller.AskQuestion(It.IsAny<QuestionDTO>());

            Assert.IsType<OkObjectResult>(result);
        }

        #endregion

        #region AnswerQuestion

        [Fact]
        public async void AnswerQuestion_ReturnsBadRequest()
        {
            _mockRepo.Setup(x => x.AnswerQuestion(It.IsAny<string>(), It.IsAny<string>())).Throws(new Exception());

            var answerDto = new AnswerDTO { Answer = It.IsAny<string>() };
            var result = await _controller.AnswerQuestion(It.IsAny<string>(), answerDto);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async void AnswerQuestion_ReturnsNotFound()
        {
            _mockRepo.Setup(x => x.AnswerQuestion(It.IsAny<string>(), It.IsAny<string>())).Throws(new QuestionNotFoundException());

            var answerDto = new AnswerDTO { Answer = It.IsAny<string>() };
            var result = await _controller.AnswerQuestion(It.IsAny<string>(), answerDto);

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async void AnswerQuestion_ReturnsOk()
        {
            _mockRepo.Setup(x => x.AnswerQuestion(It.IsAny<string>(), It.IsAny<string>())).Verifiable();

            var answerDto = new AnswerDTO { Answer = It.IsAny<string>() };
            var result = await _controller.AnswerQuestion(It.IsAny<string>(), answerDto);

            Assert.IsType<OkObjectResult>(result);
        }

        #endregion

        #region DeleteAnswer

        [Fact]
        public async void DeleteAnswer_ReturnsBadRequest()
        {
            _mockRepo.Setup(x => x.DeleteAnswer(It.IsAny<string>())).Throws(new Exception());

            var result = await _controller.DeleteAnswer(It.IsAny<string>());

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async void DeleteAnswer_ReturnsNotFound()
        {
            _mockRepo.Setup(x => x.DeleteAnswer(It.IsAny<string>())).Throws(new QuestionNotFoundException());

            var result = await _controller.DeleteAnswer(It.IsAny<string>());

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async void DeleteAnswer_ReturnsOk()
        {
            _mockRepo.Setup(x => x.DeleteAnswer(It.IsAny<string>())).Verifiable();

            var result = await _controller.DeleteAnswer(It.IsAny<string>());

            Assert.IsType<OkObjectResult>(result);
        }

        #endregion

        #region DeleteQuestion

        [Fact]
        public async void DeleteQuestion_ReturnsBadRequest()
        {
            _mockRepo.Setup(x => x.DeleteQuestion(It.IsAny<string>())).Throws(new Exception());

            var result = await _controller.DeleteQuestion(It.IsAny<string>());

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async void DeleteQuestion_ReturnsNotFound()
        {
            _mockRepo.Setup(x => x.DeleteQuestion(It.IsAny<string>())).Throws(new QuestionNotFoundException());

            var result = await _controller.DeleteQuestion(It.IsAny<string>());

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async void DeleteQuestion_ReturnsOk()
        {
            _mockRepo.Setup(x => x.DeleteQuestion(It.IsAny<string>())).Verifiable();

            var result = await _controller.DeleteQuestion(It.IsAny<string>());

            Assert.IsType<OkObjectResult>(result);
        }

        #endregion

    }
}
