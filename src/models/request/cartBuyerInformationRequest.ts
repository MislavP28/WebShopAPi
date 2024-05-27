import BuyerInformation from '../buyerInformation'

export default class CartBuyerInformationRequest {
  public kupac!: BuyerInformation

  public dostava!: BuyerInformation
}

/*
{
    "kupac": {
        "email": "test@yopmail.com",
        "ime": "test",
        "prezime": "testi",
        "brojTelefona": "123456789",
        "adresa": {
            "ulica": "Splitska",
            "broj": "21",
            "napomenaDostavljacu": null,
            "postanskiBroj": "2100",
            "grad": "Split",
            "drzava": "Hrvatska"
        }
    },
    "dostava": {
        "email": "test1@yopmail.com",
        "ime": "test1",
        "prezime": "testi1",
        "brojTelefona": "987654321",
        "adresa": {
            "adresaId": 1,
            "ulica": "Splitska",
            "broj": "21",
            "napomenaDostavljacu": null,
            "postanskiBroj": "2100",
            "grad": "Split",
            "drzava": "Hrvatska"
        }
    }
}
*/
