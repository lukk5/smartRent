using System;
using AutoMapper;
using smartRent.BackEnd.Domain.Models;
using smartRent.Repo.Entities;

namespace smartRent.BackEnd.Utils
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<UserDTO, Tenant>().ForMember(x => x.Id, o =>
                o.MapFrom(x => x.Id.ToString())).ReverseMap();

            CreateMap<UserDTO, LandLord>().ForMember(x => x.Id, o =>
                o.MapFrom(x => Guid.Parse(x.Id))).ReverseMap();
        }
    }
}