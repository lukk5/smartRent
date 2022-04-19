using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using smartRent.BackEnd.Domain.Models;
using smartRent.BackEnd.Domain.Services;
using smartRent.BackEnd.Domain.ViewModels;
using smartRent.BackEnd.Utils;
using smartRent.Repo.Entities;
using smartRent.Repo.Enums;
using smartRent.Repo.RepoInterfaces;
using smartRent.Repo.Utils;
using static smartRent.BackEnd.Utils.Hashing;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IBaseRepository<Tenant> _tenantRepo;
    private readonly IBaseRepository<LandLord> _landLordRepo;
    private readonly IBaseRepository<Credentials> _credRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly IAuthService _authService;

    public UserController(IMapper mapper, IBaseRepository<Credentials> credRepository,
        IBaseRepository<LandLord> landLordRepo, IBaseRepository<Tenant> tenantRepo, IUserRepository userRepository,
        IAuthService authService)
    {
        _credRepository = credRepository;
        _landLordRepo = landLordRepo;
        _tenantRepo = tenantRepo;
        _userRepository = userRepository;
        _authService = authService;
        _mapper = mapper;
    }

    [HttpPost]
    [Route("validate")]
    public async Task<IActionResult> ValidateUser([FromBody] UserValidateViewModel userRegViewModel)
    {
        try
        {
            var validationResult = new List<ValidationResult>();
            var tenants = await _tenantRepo.GetAllAsync();
            var landLords = await _landLordRepo.GetAllAsync();

            var users = new List<User>();

            users.AddRange(tenants);
            users.AddRange(landLords);

            if (userRegViewModel.NickName is not null && userRegViewModel.NickName != string.Empty)
            {
                var credentials = await _credRepository.GetAllAsync();

                if (credentials.SingleOrDefault(x => x.NickName == userRegViewModel.NickName) is not null)
                {
                    validationResult.Add(new ValidationResult()
                    {
                        Property = nameof(userRegViewModel.NickName),
                        Error = "Slapyvardis jau užimtas."
                    });
                }
            }

            if (userRegViewModel.Email is null or "") return Ok(validationResult);
            {
                if (users.SingleOrDefault(x => x.Email == userRegViewModel.Email) is not null)
                {
                    validationResult.Add(new ValidationResult()
                    {
                        Property = nameof(userRegViewModel.Email),
                        Error = "E.pašto adresas užimtas."
                    });
                }
            }

            return Ok(validationResult);
        }
        catch (Exception e)
        {
            return Problem(e.Message);
        }
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> LoginUser([FromBody] UserLogViewModel userLogLogin)
    {
        try
        {
            var credAll = await _credRepository.GetAllAsync();

            var currentCred = credAll.SingleOrDefault(x => x.NickName == userLogLogin.NickName);

            if (currentCred is null)
                return NoContent();

            if (!VerifyHashedPassword(userLogLogin.NickName, currentCred.Password, userLogLogin.Password))
                return Unauthorized();

            User user = null;
            var type = "";

            var tenant = await _tenantRepo.GetByIdAsync(currentCred.UserId);
            var landLord = await _landLordRepo.GetByIdAsync(currentCred.UserId);

            if (tenant is null)
            {
                if (landLord is not null)
                {
                    user = landLord;
                    type = "landLord";
                }
            }
            else
            {
                user = tenant;
                type = "tenant";
            }

            if (user is null)
                return NoContent();

            var auth = _authService.GetAuthData(user.Id.ToString());

            auth.UserType = type;

            return Ok(auth);
        }
        catch (Exception e)
        {
            return Problem(e.Message);
        }
    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> RegisterUser([FromBody] UserRegViewModel userRegViewModel)
    {
        try
        {
            UserDTO userDto = null;

            Credentials userCredentials = new()
            {
                Id = Guid.NewGuid(),
                NickName = userRegViewModel.NickName,
                Password = HashPassword(userRegViewModel.NickName, userRegViewModel.Password)
            };

            if (userRegViewModel.isLandLord)
            {
                LandLord user = new()
                {
                    Id = Guid.NewGuid(),
                    LastName = userRegViewModel.LastName,
                    Name = userRegViewModel.FirstName,
                    Phone = userRegViewModel.Phone,
                    Email = userRegViewModel.Email
                };

                if (await _userRepository.RegisterLandLord(user, userCredentials))
                {
                    userDto = _mapper.Map<User, UserDTO>(await _userRepository.GetByFullNameAndType(
                        userRegViewModel.FirstName,
                        userRegViewModel.LastName, UserType.Landlord));
                }
            }
            else
            {
                Tenant user = new()
                {
                    Id = Guid.NewGuid(),
                    LastName = userRegViewModel.LastName,
                    Name = userRegViewModel.FirstName,
                    Phone = userRegViewModel.Phone,
                    Email = userRegViewModel.Email
                };

                if (await _userRepository.RegisterTenant(user, userCredentials))
                {
                    userDto = _mapper.Map<User, UserDTO>(await _userRepository.GetByFullNameAndType(
                        userRegViewModel.FirstName,
                        userRegViewModel.LastName, UserType.Tenant));
                }
            }

            if (userDto is null)
                return NoContent();

            return Ok();
        }
        catch (Exception e)
        {
            return Problem(e.Message);
        }
    }

    [HttpPut]
    [Route("updatePassword")]
    [Authorize]
    public async Task<IActionResult> UpdateUserPassword([FromBody] UserPasswordViewModel userPasswordViewModel)
    {
        var credAll = await _credRepository.GetAllAsync();

        var currentCred = credAll.SingleOrDefault(x => x.UserId == Guid.Parse(userPasswordViewModel.Id));

        if (currentCred is null)
            return NoContent();

        currentCred.Password = HashPassword(currentCred.NickName, userPasswordViewModel.Password);

        await _credRepository.UpdateAsync(currentCred);

        return Ok();
    }

    [HttpPost]
    [Route("checkOldPassword")]
    [Authorize]
    public async Task<IActionResult> CheckOldPassword([FromBody] UserPasswordViewModel userPasswordViewModel)
    {
        var credAll = await _credRepository.GetAllAsync();
        var cred = credAll.SingleOrDefault(x => x.UserId == Guid.Parse(userPasswordViewModel.Id));

        if (cred is null)
            return NoContent();

        var result = VerifyHashedPassword(cred.NickName, cred.Password, userPasswordViewModel.Password);

        return Ok(result);
    }

    [HttpPut]
    [Route("updateContactDetail")]
    [Authorize]
    public async Task<IActionResult> UpdateContactDetail([FromBody] UserContactViewModel userContactViewModel)
    {
        Tenant tenant = null;
        LandLord landLord = null;
        UserDTO userDto = null;

        if (userContactViewModel.Type == "landLord")
        {
            landLord = await _landLordRepo.GetByIdAsync(Guid.Parse(userContactViewModel.Id));
        }
        else
        {
            tenant = await _tenantRepo.GetByIdAsync(Guid.Parse(userContactViewModel.Id));
        }

        if (tenant is null && landLord is null)
            return NoContent();

        if (userContactViewModel.Type == "landLord" && landLord is not null)
        {
            if (userContactViewModel.Email is not null)
                landLord.Email = userContactViewModel.Email;

            if (userContactViewModel.Phone is not null)
                landLord.Phone = userContactViewModel.Phone;
            await _landLordRepo.UpdateAsync(landLord);

            userDto = _mapper.Map<User, UserDTO>(landLord);
            userDto.UserType = "landLord";
        }
        else if (tenant is not null)
        {
            if (userContactViewModel.Email != "")
                tenant.Email = userContactViewModel.Email;

            if (userContactViewModel.Phone != "")
                tenant.Phone = userContactViewModel.Phone;
            await _tenantRepo.UpdateAsync(tenant);

            userDto = _mapper.Map<User, UserDTO>(tenant);
            userDto.UserType = "tenant";
        }

        return Ok(userDto);
    }

    [HttpGet]
    [Route("get/{id}")]
    [Authorize]
    public async Task<IActionResult> GetUser([FromRoute] string id, [FromRoute] bool landLord)
    {
        return await Try.Action(async () =>
        {
            var user = await _landLordRepo.GetByIdAsync(Guid.Parse(id)) ??
                       (User) await _tenantRepo.GetByIdAsync(Guid.Parse(id));

            if (user is null) throw ExceptionUtil.ObjectNullException(user);

            return Ok(_mapper.Map<User, UserDTO>(user));
            
        }).Finally(10);
    }
}