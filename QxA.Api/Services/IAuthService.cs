namespace QxA.Api.Services
{
    public interface IAuthService
    {
        /// <summary>
        /// Compares if the username encrypted on the JWT token is equal to the other one.
        /// </summary>
        /// <param name="jwtToken">The JWT token extracted from the HTTP header. With or without the "Bearer " substring.</param>
        /// <param name="username">The username to compare it to.</param>
        /// <returns></returns>
        bool AuthorizeUsernameWithToken(string jwtToken, string username);
    }
}
