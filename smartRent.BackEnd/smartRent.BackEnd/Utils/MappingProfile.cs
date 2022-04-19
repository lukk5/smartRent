using System;
using AutoMapper;
using smartRent.BackEnd.Domain.Models;
using smartRent.Repo.Entities;
using smartRent.Repo.Enums;

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


            CreateMap<RentObjectDTO, RentObject>().ForMember(x => x.Id, o =>
                    o.MapFrom(x => Guid.Parse(x.Id))).ForMember(p => p.Currency, l
                    => l.MapFrom(p => (Currency) Enum.Parse(typeof(Currency), p.Currency, true)))
                .ForMember(x => x.Type, n => n.MapFrom(
                    z => (ObjectType) Enum.Parse(typeof(ObjectType), z.Type, true)))
                .ForMember(x => x.TenantId, p => p.MapFrom(
                    l=> Guid.Parse(l.TenantId)))
                .ForMember(s=> s.LandLordId, l=> l.MapFrom(
                    q=> Guid.Parse(q.LandLordId)));

            CreateMap<RentObject, RentObjectDTO>().ForMember(x => x.Id, o =>
                o.MapFrom(p => p.Id.ToString())).ForMember(x=> x.LandLordId, d=> 
                d.MapFrom(a=>a.LandLordId.ToString())).ForMember(x=> x.TenantId, d=>
                d.MapFrom(p=>p.TenantId.ToString()));
        }
    }
}