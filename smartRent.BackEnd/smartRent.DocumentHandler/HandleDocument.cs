using System.IO;
using System.IO.Compression;
using GrapeCity.Documents.Word;
using GrapeCity.Documents.Word.Layout;

namespace smartRent.DocumentHandler
{
    public class DocumentBody
    {
        public string Address { get; set; }
        public string TenantName { get; set; }
        public string LandLordName { get; set; }
        public string DocumentNr { get; set; }
        public string Price { get; set; }
        public string Date1 { get; set; }
        public string Date2 { get; set; }
        public string Date3 { get; set; }
        public string Date1Payment { get; set; }
        public string Date2Payment { get; set; }
        public string Date3Payment { get; set; }
        public string Dimensions { get; set; }
    }

    public class HandleDocument
    {
        private readonly string filePath = Directory.GetCurrentDirectory() + "/data/";

        private GcWordDocument _doc;

        public HandleDocument()
        {
            _doc = new GcWordDocument();
        }

        public void FillDocument(DocumentBody body, string name)
        {
            _doc.Body.Sections.First.GetRange().Paragraphs.Add(renderBody(body));
            using (var layout = new GcWordLayout(_doc))
            {
                layout.SaveAsPdf(filePath + name, null,
                    new PdfOutputSettings() {CompressionLevel = CompressionLevel.Optimal});
            }
        }

        private string renderBody(DocumentBody body)
        {
            return @$"GYVENAMŲJŲ PATALPŲ NUOMOS SUTARTIS Nr." + body.DocumentNr + " " +
                   body.Date1 + @" m. " + body.Date2 + " mėn. " + body.Date3 + @"d. Aš, " + body.LandLordName +
                   @" (toliau Nuomotojas), buto savininkas iš vienos pusės, ir " + body.TenantName +
                   @" (toliau sutartyje – Nuomininkas), iš kitos pusės, sudarėme šią nuomos sutartį:
            1.	SUTARTIES OBJEKTAS 
1.1.	Šia sutartimi Nuomotojas perduoda Nuomininkui laikinai valdyti ir naudoti " + body.Dimensions +
                   @" bendrojo ploto gyvenamąsias patalpas, esančias " + body.Address +
                   @" (toliau sutartyje - nuomojamos patalpos), o Nuomininkas įsipareigoja mokėti nuomos mokestį.
1.2.	Nuomininkas moka Nuomotojui mėnesinį " + body.Price + @" nuomos mokestį. 
1.3.	Nuomininkas kiekvieną mėnesį moka Nuomotojui nuomojamų patalpų komunalinių ir kitų paslaugų mokesčius.
1.4.	Šalys susitaria, kad patalpos Nuomininkui išnuomojamos iki dataEnd1 m. dataEnd2 mėn. dataEnd3 d.

2.	MOKĖJIMŲ IR ATSISKAITYMŲ PAGAL SUTARTĮ TVARKA
2.1.	Nuomininkas kiekvieną mėnesį, ne vėliau kaip iki einamojo mėnesio " + body.Date1Payment +
                   " dienos, sumoka Nuomotojui " + body.Price + @" dydžio mėnesinį nuomos mokestį už einamąjį mėnesį.
2.2.	Pasirašant sutartį Nuomininkas sumoka dviejų mėnesinių nuomos mokesčių avansą – Eur. 
2.3.	Nuomininkas kiekvieną mėnesį, ne vėliau kaip iki einamojo mėnesio " + body.Date1Payment +
                   @" dienos, apmoka Nuomotojui nuomojamų patalpų komunalinių ir kitų paslaugų mokesčius už praėjusį mėnesį.
2.4.	Pasibaigus šios sutarties terminui ar nutraukus ją prieš terminą, Nuomininkas sumoka visas Nuomotojui pagal šią sutartį mokėtinas sumas per 30 (trisdešimt) kalendorinių dienų nuo sutarties termino pasibaigimo ar sutarties nutraukimo dienos.

3.	ŠALIŲ ĮSIPAREIGOJIMAI
3.1.	Pagal šią sutartį Nuomotojas įsipareigoja:
3.1.1.	per dvi darbo dienas nuo sutarties pasirašymo dienos perduoti Nuomininkui šios sutarties 1.1. punkte nurodytas nuomojamas patalpas. Nuomojamos patalpos perduodamos dalyvaujant abiem šalims ar jų įgaliotiems atstovams, kurie sudaro ir pasirašo nuomojamų patalpų perdavimo-priėmimo aktą (Priedas Nr.1);
3.1.2.	savo lėšomis atlikti nuomojamų patalpų kapitalinį remontą, kai vykdomas viso pastato ar gretimų, su nuomojamomis patalpomis susisiejančių patalpų rekonstravimas ar remontas;
3.1.3.	pasibaigus nuomos sutarties terminui arba nutraukus šią sutartį, priimti iš Nuomininko nuomojamas patalpas sudarant perdavimo-priėmimo aktą;
3.1.4.	atlyginti Nuomininkui jo turėtas būtinąsias (pagrįstas dokumentais) nuomojamų patalpų pagerinimo išlaidas, padarytas Nuomotojo leidimu. Kai pagerinimai padaryti be Nuomotojo sutikimo arba šalys susitaria, jog Nuomininko patalpų pagerinimo išlaidos nebus atlyginamos, Nuomininkas neturi teisės į išlaidų, susijusių su nuomojamų patalpų pagerinimu, kompensavimą;
3.2.	Pagal šią sutartį Nuomininkas įsipareigoja:
3.2.1.	laikytis nuomojamose patalpose priešgaisrinės saugos, aplinkos apsaugos, taip pat higienos bei sanitarinių normų. Nuomininkas atsako už šių taisyklių bei normų nesilaikymo pasekmes ir atlygina dėl to atsiradusią žalą;
3.2.2.	be Nuomotojo raštiško sutikimo nesubnuomoti nuomojamų patalpų ar jų dalies.
3.2.3.	be Nuomotojo raštiško sutikimo neperleisti šia sutartimi įgytų teisių ir pareigų tretiesiems asmenims, neįkeisti nuomos teisės ar kitaip jos nesuvaržyti;
3.2.4.	be Nuomotojo raštiško leidimo neperplanuoti ir nepertvarkyti nuomojamų patalpų ar jų dalies;
3.2.5.	suderinus su Nuomotoju, savo lėšomis atlikti nuomojamų patalpų bei vidaus inžinierinių tinklų priežiūrą ir einamąjį remontą. 
3.2.6.	pilnai atlyginti Nuomotojui nuostolius, susijusius su nuomojamų patalpų pabloginimu, jeigu tai įvyksta dėl Nuomininko kaltės;
3.2.7.	ne vėliau kaip prieš dvi savaites iki šios sutarties galiojimo termino pasibaigimo, jam patogiu būdu (žodžiu, faksu, telefonu ar kt.) pranešti Nuomotojui apie paliekamas nuomojamas patalpas;
3.2.8.	pasibaigus šios sutarties terminui arba ją nutraukus prieš terminą, per dvi darbo dienas perduoti Nuomotojui nuomojamas patalpas remiantis perdavimo-priėmimo aktu (Priedas Nr. 1) su visais jose padarytais pertvarkymais, kurie negali būti atskiriami nuo patalpų nepadarant žalos jų būklei;
3.2.9.	laiku mokėti Nuomotojui nuompinigius už naudojimąsi nuomojamomis patalpomis ir komunalinių bei kitų paslaugų mokesčius.

4.	SUTARTIES GALIOJIMO TERMINAS IR NUTRAUKIMO TVARKA
4.1.	Kiekviena sutarties šalis turi teisę nutraukti šią sutartį raštu įspėjusi apie tai kitą šalį prieš dvi savaites.
4.2.	Nuomotojas turi teisę teismine tvarka nutraukti šią sutartį nesilaikant 4.1. punkte nurodyto įspėjimo termino, jeigu:
4.2.1.	Nuomininkas naudojasi daiktu ne pagal sutartį ar daikto paskirtį;
4.2.2.	Nuomininkas tyčia ar dėl neatsargumo blogina daikto būklę;
4.2.3.	Nuomininkas nemoka nuomos ir kitų mokesčių pagal sutartį;
4.2.4.	Nuomininkas nevykdo vidaus inžinierinių tinklų priežiūros ir nedaro einamojo remonto arba nedaro kapitalinio nuomojamų patalpų remonto, kurį jis privalo daryti remiantis atskiru rašytiniu šalių susitarimu;
4.2.5.	Nuomininkas blogina nuomojamų patalpų ar jose esančių inžinierinių tinklų būklę.
4.3.	Nuomininkas turi teisę teismine tvarka nutraukti šią Sutartį nesilaikant 4.1. punkte nurodyto įspėjimo termino, jeigu:
4.3.1.	Nuomotojas neperduoda nuomojamų patalpų Nuomininkui arba kliudo naudotis jomis pagal jų paskirtį ir šios sutarties sąlygas;
4.3.2.	perduotos nuomojamos patalpos yra su trūkumais, kurie Nuomotojo nebuvo aptarti ir Nuomininkui nebuvo žinomi, o dėl šių trūkumų jų neįmanoma naudoti pagal paskirtį ir šios sutarties sąlygas;
4.4.	Sutarties šalys turi teisę nutraukti šią sutartį abipusiu rašytiniu susitarimu, nesilaikant sutarties 4.1. punkte nurodyto įspėjimo termino.
4.5.	Pasibaigus nuomos sutarties terminui ar nutraukus nuomos sutartį, Nuomininkas turi teisę pasiimti nuomojamų patalpų pagerinimus, jeigu juos galima atskirti be žalos nuomojamoms patalpoms.

5.	ŠALIŲ ATSAKOMYBĖ
5.1.	Nuomininkas atlygina Nuomotojui dėl nuomojamų patalpų pabloginimo atsiradusius nuostolius, išskyrus tuos atvejus, kai įrodo, kad daiktas pablogėjo ne dėl jo kaltės.
5.2.	Nuomininkas įsipareigoja mokėti Nuomotojui 0,2 % dydžio delspinigius nuo laiku nesumokėtos nuomos ar kitų mokesčių pagal sutartį sumos už kiekvieną uždelstą dieną.
5.3.	Sutarties šalis atleidžiama nuo atsakomybės už savo sutartinių įsipareigojimų nevykdymą, jeigu ji įrodo, kad šių įsipareigojimų nebuvo galima įvykdyti dėl “force majeure” aplinkybių, kurių sutarties sudarymo momentu ši šalis negalėjo numatyti ir kurių ji negalėjo išvengti ar įveikti. Nustatant “force majeure” aplinkybes, taikomos Lietuvos Respublikos Vyriausybės 1996 liepos 15 d. nutarimo Nr. 840 nuostatos (V.Ž. 19960719 Nr.68).
5.4.	Šalis, prašanti atleisti nuo atsakomybės, sužinojusi apie force majeure aplinkybę bei jos poveikį įsipareigojimų vykdymui, kuo skubiau turi pranešti kitai šaliai apie susidariusią situaciją. Būtina pranešti ir tuomet, kai išnyksta pagrindas nevykdyti įsipareigojimų. Pagrindas atleisti nuo atsakomybės atsiranda nuo kliūties atsiradimo momento arba, jeigu apie ją laiku pranešta, nuo pranešimo momento. Laiku nepranešusi įsipareigojimų nevykdanti šalis tampa iš dalies atsakinga už nuostolių, kurių priešingu atveju būtų išvengta, atlyginimą.

6.	BAIGIAMOSIOS NUOSTATOS
6.1.	Ši sutartis įsigalioja nuo jos pasirašymo dienos, patvirtinus liudininkams ir galioja iki sutarties 1.4. punkte nurodyto termino pabaigos.
6.2.	Jeigu pasibaigus sutarties terminui nuomininkas daugiau kaip dešimt dienų toliau naudojasi turtu ir nuomotojas tam neprieštarauja, laikoma, kad sutartis tapo neterminuota.
6.3.	Nuomininkas, tvarkingai vykdęs pagal nuomos sutartį prisiimtus įsipareigojimus, pasibaigus sutarties terminui turi pirmenybės teisę palyginti su kitais asmenimis atnaujinti sutartį. Nuomotojas privalo likus savaitei iki nuomos termino pasibaigimo dienos pranešti Nuomininkui apie šio teisę sudaryti nuomos sutartį naujam terminui. Sudarant nuomos sutartį naujam terminui, jos sąlygos šalių susitarimu gali būti pakeistos.
6.4.	Sutartis gali būti pakeista arba papildyta tik raštišku abiejų šalių susitarimu.
6.5.	Sutarties priedas Nr. 1 yra neatskiriama sutarties dalis.


7.	ŠALIŲ REKVIZITAI IR PARAŠAI

7.1. Nuomotojas:   " + body.LandLordName + @"                     7.2.Nuomininkas:   " + body.TenantName + @"
";
        }
    }
}