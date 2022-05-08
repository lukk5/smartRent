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
                .ForMember(x => x.LandLordId, o => o.MapFrom(
                    z => Guid.Parse(z.LandLordId)));

            CreateMap<RentObject, RentObjectDTO>().ForMember(x => x.Id, o =>
                o.MapFrom(p => p.Id.ToString()));

            CreateMap<Bills, BillDTO>().ForMember(x => x.Id, o => o.MapFrom(p => p.Id.ToString()))
                .ForMember(x => x.ValidFrom, o => o.MapFrom(p => p.ValidFrom.ToString("yyyy-MM-dd")))
                .ForMember(x => x.ValidTo, o => o.MapFrom(p => p.ValidTo.ToString("yyyy-MM-dd")));

            CreateMap<BillDTO, Bills>().ForMember(x => x.Id, o => o.MapFrom(p => Guid.Parse(p.Id)))
                .ForMember(x => x.ValidFrom, o => o.MapFrom(p => DateTime.Parse(p.ValidFrom)))
                .ForMember(x => x.ValidTo, o => o.MapFrom(p => DateTime.Parse(p.ValidTo)));
            
            CreateMap<Rent,RentDTO>().ForMember(x => x.Id, o => o.MapFrom(p => p.Id.ToString()))
                .ForMember(x => x.StartingDate, o => o.MapFrom(p => p.StartingDate.ToString("yyyy-MM-dd")))
                .ForMember(x => x.EndingDate, o => o.MapFrom(p => p.EndingDate.ToString("yyyy-MM-dd")));
            
            CreateMap<RentDTO, Rent>().ForMember(x => x.Id, o => o.MapFrom(p => Guid.Parse(p.Id)))
                .ForMember(x => x.StartingDate, o => o.MapFrom(p => DateTime.Parse(p.StartingDate)))
                .ForMember(x => x.EndingDate, o => o.MapFrom(p => DateTime.Parse(p.EndingDate)));
        }
    }
}