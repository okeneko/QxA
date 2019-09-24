using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace QxA.Api.Services
{
    public class AuthService : IAuthService
    {
        public bool AuthorizeUsernameWithToken(string jwtToken, string username)
        {
            string token = "";
            if (jwtToken.Substring(0, 6).Equals("Bearer"))
            {
                token = jwtToken.Substring(7);
            }
            else
            {
                token = jwtToken;
            }

            var tokenHandler = new JwtSecurityTokenHandler().ReadJwtToken(token);
            string tokenUsername = tokenHandler.Claims.First(claim => claim.Type == JwtRegisteredClaimNames.NameId).Value;

            return tokenUsername.Equals(username);
        }
    }
}
