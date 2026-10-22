/* Dados padrão e funções comuns do Ale Top Lanches.
   Usado pelo cardápio (index.html) e pelo painel (admin.html).
   Aqui só tem o cardápio inicial: nenhuma senha, nenhum dado de cliente. */
(function(){
'use strict';
var ALE={};
/* Horário de atendimento (fuso de São Paulo). 0 = domingo ... 6 = sábado. null = fechado. */
ALE.SCHEDULE={0:[18,23],1:null,2:[16,23],3:[16,23],4:[16,23],5:[16,23],6:[16,23]};
ALE.CARDAPIO_PADRAO={
 "categorias": [
  {
   "cat": "Combos",
   "items": [
    {
     "id": "combosemana",
     "name": "Combo Top da Semana",
     "desc": "2 Top Bacon artesanais, porção de batata com bacon e cheddar, porção de anéis de cebola, molho de alho 60 ml, 2 chocolates Trento e Guaraná Antarctica 1 L.",
     "v": [
      {
       "n": "",
       "p": 90
      }
     ],
     "foto": "foto-combosemana.webp"
    },
    {
     "id": "especial",
     "name": "Combo Especial",
     "desc": "1 Bacon Especial (pão, hambúrguer 150 g, bacon em tiras, cheddar fatiado, maionese e barbecue), batata frita pequena e Coca-Cola lata 350 ml.",
     "v": [
      {
       "n": "",
       "p": 38
      }
     ],
     "foto": "foto-especial.webp"
    },
    {
     "id": "casa",
     "name": "Combo da Casa",
     "desc": "1 Bacon com Cheddar (pão, hambúrguer 150 g, cheddar fatiado, bacon em tiras, barbecue, picles, cebola roxa, tomate, alface e maionese do chefe), batata pequena e Coca-Cola lata 350 ml.",
     "v": [
      {
       "n": "",
       "p": 44
      }
     ],
     "foto": "foto-casa.webp"
    },
    {
     "id": "mini4",
     "name": "Combo 4 Mini",
     "desc": "4 mini bacon (pão, hambúrguer 75 g, bacon em tiras, cheddar fatiado, maionese e barbecue), batata frita média e 4 Coca-Cola 200 ml.",
     "v": [
      {
       "n": "",
       "p": 71
      }
     ],
     "foto": "foto-mini4.webp"
    },
    {
     "id": "mini2",
     "name": "Combo 2 Mini",
     "desc": "2 mini bacon (pão, hambúrguer 75 g, bacon em tiras, cheddar fatiado, maionese e barbecue), batata frita pequena e 2 Coca-Cola 200 ml.",
     "v": [
      {
       "n": "",
       "p": 40
      }
     ],
     "foto": "foto-mini2.webp"
    },
    {
     "id": "familia",
     "name": "Combo Família",
     "desc": "4 X-Salada com pão tradicional, hambúrguer, queijo, alface, tomate e maionese do chefe, batata frita média e Guaraná 2 L.",
     "v": [
      {
       "n": "Industrializado",
       "p": 71
      },
      {
       "n": "Artesanal",
       "p": 91
      }
     ],
     "foto": "foto-familia.webp"
    },
    {
     "id": "casal",
     "name": "Combo Casal",
     "desc": "2 X-Salada com pão tradicional, hambúrguer, queijo, alface, tomate e maionese do chefe, batata frita pequena e Guaraná 600 ml.",
     "v": [
      {
       "n": "Industrializado",
       "p": 42
      },
      {
       "n": "Artesanal",
       "p": 51
      }
     ],
     "foto": ""
    }
   ],
   "x": false,
   "br": false,
   "sub": "",
   "note": ""
  },
  {
   "cat": "Gourmet",
   "x": true,
   "items": [
    {
     "id": "tricheddarloco",
     "name": "Tri Cheddar Loco",
     "desc": "Pão, 3 hambúrgueres de 150 g, 6 fatias de cheddar, cebola roxa, picles, tomate, alface americana e maionese do chefe.",
     "v": [
      {
       "n": "",
       "p": 44
      }
     ],
     "foto": ""
    },
    {
     "id": "duplocheddar",
     "name": "Duplo Cheddar Bacon",
     "desc": "Pão, 2 hambúrgueres de 150 g, 4 fatias de cheddar, bacon em tiras, molho barbecue, cebola roxa, picles, tomate, alface americana e maionese do chefe.",
     "v": [
      {
       "n": "",
       "p": 41
      }
     ],
     "foto": ""
    },
    {
     "id": "bifecavalo",
     "name": "Bife a Cavalo",
     "desc": "Pão, hambúrguer 150 g, iscas de carne, ovo, bacon em tiras, mussarela, molho barbecue, tomate, alface americana e maionese do chefe.",
     "v": [
      {
       "n": "",
       "p": 34
      }
     ],
     "foto": ""
    },
    {
     "id": "costela",
     "name": "Costela",
     "desc": "Pão, costela desfiada, hambúrguer artesanal 150 g, queijo Philadelphia, mussarela, molho barbecue, pimentão verde, cebola, shoyu e maionese do chefe.",
     "v": [
      {
       "n": "",
       "p": 34
      }
     ],
     "foto": ""
    },
    {
     "id": "supremenachos",
     "name": "Supreme Nachos",
     "desc": "Pão, hambúrguer 150 g, cheddar fatiado, pimentão verde, Doritos e maionese do chefe.",
     "v": [
      {
       "n": "",
       "p": 28
      }
     ],
     "foto": ""
    },
    {
     "id": "coracao",
     "name": "Coração",
     "desc": "Pão, coração, queijo, cebola roxa, picles, tomate, alface americana e maionese do chefe.",
     "v": [
      {
       "n": "",
       "p": 27
      }
     ],
     "foto": ""
    },
    {
     "id": "vegetariano",
     "name": "Vegetariano",
     "desc": "Pão, maionese do chefe, alface americana, tomate, cebola roxa, picles, queijo e hambúrguer vegano 120 g.",
     "v": [
      {
       "n": "",
       "p": 24
      }
     ],
     "foto": ""
    },
    {
     "id": "file",
     "name": "Filé",
     "desc": "Pão, iscas de carne, pimentão verde, tomate, cebola, mussarela e maionese do chefe.",
     "v": [
      {
       "n": "",
       "p": 27
      }
     ],
     "foto": "foto-file.webp"
    },
    {
     "id": "americano",
     "name": "Americano",
     "desc": "Pão, hambúrguer de costela 150 g, tomate em rodelas, picles, cebola roxa, maionese do chefe, mussarela fatiada, bacon em tiras e coleslaw (salada de repolho).",
     "v": [
      {
       "n": "",
       "p": 34
      }
     ],
     "foto": "foto-americano.webp"
    },
    {
     "id": "farmbacon",
     "name": "Farm Bacon",
     "desc": "Pão, hambúrguer de costela 150 g, bacon em tiras, queijo minas, barbecue e maionese.",
     "v": [
      {
       "n": "",
       "p": 34
      }
     ],
     "foto": "foto-farmbacon.webp"
    },
    {
     "id": "duplobacon",
     "name": "Duplo Bacon 2.0",
     "desc": "Pão, 2 hambúrgueres de 150 g, mussarela, bacon em tiras e maionese do chefe.",
     "v": [
      {
       "n": "",
       "p": 40
      }
     ],
     "foto": "foto-duplobacon.webp"
    },
    {
     "id": "frangosupreme",
     "name": "Frango Supreme",
     "desc": "Pão, hambúrguer 150 g, iscas de frango, queijo Philadelphia, mussarela, bacon em tiras, barbecue, tomate, alface americana e maionese do chefe.",
     "v": [
      {
       "n": "",
       "p": 34
      }
     ],
     "foto": "foto-frangosupreme.webp"
    },
    {
     "id": "baconcheddar",
     "name": "Bacon c/ Cheddar",
     "desc": "Pão, hambúrguer artesanal 150 g, cheddar fatiado, bacon em tiras, molho barbecue, alface americana, tomate, cebola roxa, picles e maionese do chefe.",
     "v": [
      {
       "n": "",
       "p": 32
      }
     ],
     "foto": "foto-baconcheddar.webp"
    },
    {
     "id": "baconcrispy",
     "name": "Bacon Crispy",
     "desc": "Pão, hambúrguer 150 g de costela, cheddar cremoso, bacon em tiras, cheddar fatiado, cebola crispy, barbecue e maionese do chefe.",
     "v": [
      {
       "n": "",
       "p": 34
      }
     ],
     "foto": "foto-baconcrispy.webp"
    },
    {
     "id": "baconcremoso",
     "name": "Bacon Cremoso",
     "desc": "Pão, hambúrguer 150 g, cheddar cremoso, bacon em tiras, barbecue e maionese do chefe.",
     "v": [
      {
       "n": "",
       "p": 30
      }
     ],
     "foto": ""
    },
    {
     "id": "baconespecial",
     "name": "Bacon Especial",
     "desc": "Pão, hambúrguer artesanal 150 g, cheddar fatiado, bacon em tiras, molho barbecue e maionese do chefe.",
     "v": [
      {
       "n": "",
       "p": 30
      }
     ],
     "foto": ""
    },
    {
     "id": "tricheddarbacon",
     "name": "Tri Cheddar Bacon",
     "desc": "Pão, 3 hambúrgueres de 150 g, 6 fatias de cheddar, bacon em tiras, molho barbecue, cebola roxa, picles, tomate, alface americana e maionese do chefe.",
     "v": [
      {
       "n": "",
       "p": 50
      }
     ],
     "foto": ""
    },
    {
     "id": "minibacon",
     "name": "Mini Bacon",
     "desc": "Pão mini, hambúrguer 75 g, cheddar, bacon em tiras, barbecue e maionese do chefe.",
     "v": [
      {
       "n": "",
       "p": 14
      }
     ],
     "foto": ""
    },
    {
     "id": "kids",
     "name": "Kids",
     "desc": "Pão mini, hambúrguer artesanal 75 g e mussarela.",
     "v": [
      {
       "n": "",
       "p": 12
      }
     ],
     "foto": ""
    }
   ],
   "br": false,
   "sub": "",
   "note": ""
  },
  {
   "cat": "Top Lanches",
   "x": true,
   "sub": "Escolha entre industrializado (hambúrguer 90 g) e artesanal (hambúrguer 150 g).",
   "items": [
    {
     "id": "topburguer",
     "name": "Top Burguer",
     "desc": "Pão, hambúrguer, queijo mussarela e maionese.",
     "v": [
      {
       "n": "Industrializado · 90 g",
       "p": 12
      },
      {
       "n": "Artesanal · 150 g",
       "p": 18
      }
     ],
     "foto": ""
    },
    {
     "id": "topsalada",
     "name": "Top Salada",
     "desc": "Pão, hambúrguer, mussarela, maionese, tomate e alface.",
     "v": [
      {
       "n": "Industrializado · 90 g",
       "p": 14
      },
      {
       "n": "Artesanal · 150 g",
       "p": 19
      }
     ],
     "foto": ""
    },
    {
     "id": "topbacon",
     "name": "Top Bacon",
     "desc": "Pão, hambúrguer, mussarela, bacon em tiras, maionese, tomate e alface.",
     "v": [
      {
       "n": "Industrializado · 90 g",
       "p": 19
      },
      {
       "n": "Artesanal · 150 g",
       "p": 25
      }
     ],
     "foto": ""
    },
    {
     "id": "topfrango",
     "name": "Top Frango",
     "desc": "Pão, hambúrguer, mussarela, frango em cubos, maionese, tomate e alface.",
     "v": [
      {
       "n": "Industrializado · 90 g",
       "p": 19
      },
      {
       "n": "Artesanal · 150 g",
       "p": 25
      }
     ],
     "foto": ""
    },
    {
     "id": "topcalabresa",
     "name": "Top Calabresa",
     "desc": "Pão, hambúrguer, mussarela, calabresa fatiada, maionese, tomate e alface.",
     "v": [
      {
       "n": "Industrializado · 90 g",
       "p": 19
      },
      {
       "n": "Artesanal · 150 g",
       "p": 25
      }
     ],
     "foto": ""
    },
    {
     "id": "topegg",
     "name": "Top Egg",
     "desc": "Pão, hambúrguer, mussarela, ovo, maionese, tomate e alface.",
     "v": [
      {
       "n": "Industrializado · 90 g",
       "p": 19
      },
      {
       "n": "Artesanal · 150 g",
       "p": 25
      }
     ],
     "foto": ""
    },
    {
     "id": "topduplo",
     "name": "Top Duplo",
     "desc": "Pão, 2 hambúrgueres, mussarela, cheddar cremoso, bacon em tiras, maionese, tomate e alface.",
     "v": [
      {
       "n": "Industrializado · 2 × 90 g",
       "p": 26
      },
      {
       "n": "Artesanal · 2 × 150 g",
       "p": 34
      }
     ],
     "foto": ""
    }
   ],
   "br": false,
   "note": ""
  },
  {
   "cat": "Prensados",
   "x": true,
   "items": [
    {
     "id": "prtrad",
     "name": "Prensado Tradicional",
     "desc": "Pão, 2 vinas, milho, cebola, tomate, batata palha, mussarela, maionese, catchup e mostarda.",
     "v": [
      {
       "n": "",
       "p": 16
      }
     ],
     "foto": ""
    },
    {
     "id": "prcostela",
     "name": "Prensado de Costela",
     "desc": "Pão, 2 vinas, milho, cebola, tomate, pimentão, batata palha, costela, cream cheese, mussarela, maionese, catchup e mostarda.",
     "v": [
      {
       "n": "",
       "p": 28
      }
     ],
     "foto": "foto-prcostela.webp"
    },
    {
     "id": "prbacon",
     "name": "Prensado de Bacon",
     "desc": "Pão, 2 vinas, milho, cebola, tomate, batata palha, mussarela, bacon em tiras, maionese, catchup e mostarda.",
     "v": [
      {
       "n": "",
       "p": 22
      }
     ],
     "foto": ""
    },
    {
     "id": "prnachos",
     "name": "Prensado de Nachos",
     "desc": "Pão, 2 vinas, milho, cebola, tomate, batata palha, mussarela, cheddar cremoso, Doritos, maionese, catchup e mostarda.",
     "v": [
      {
       "n": "",
       "p": 28
      }
     ],
     "foto": ""
    },
    {
     "id": "prcalabresa",
     "name": "Prensado de Calabresa",
     "desc": "Pão, 2 vinas, milho, cebola, tomate, batata palha, mussarela, calabresa fatiada, maionese, catchup e mostarda.",
     "v": [
      {
       "n": "",
       "p": 20
      }
     ],
     "foto": ""
    },
    {
     "id": "pr3queijos",
     "name": "Prensado ao 3 Queijos",
     "desc": "Pão, 2 vinas, milho, cebola, tomate, batata palha, cream cheese, mussarela, cheddar cremoso, maionese, catchup e mostarda.",
     "v": [
      {
       "n": "",
       "p": 26
      }
     ],
     "foto": ""
    }
   ],
   "br": false,
   "sub": "",
   "note": ""
  },
  {
   "cat": "Shawarmas",
   "x": true,
   "br": true,
   "note": "Na compra do shawarma você leva uma Coca-Cola lata 350 ml.",
   "items": [
    {
     "id": "shmisto",
     "name": "Shawarma Misto",
     "desc": "Pão sírio, tomate, picles, iscas de carne, iscas de frango, creme de alho e batata frita.",
     "v": [
      {
       "n": "",
       "p": 38
      }
     ],
     "foto": "foto-shmisto.webp"
    },
    {
     "id": "shcarne",
     "name": "Shawarma de Carne",
     "desc": "Pão sírio 30 cm, tomate, picles, iscas de carne, creme de alho e batata frita.",
     "v": [
      {
       "n": "",
       "p": 38
      }
     ],
     "foto": ""
    },
    {
     "id": "shfrango",
     "name": "Shawarma de Frango",
     "desc": "Pão sírio, tomate, picles, iscas de frango, creme de alho e batata frita.",
     "v": [
      {
       "n": "",
       "p": 38
      }
     ],
     "foto": ""
    },
    {
     "id": "shnachos",
     "name": "Shawarma de Nachos",
     "desc": "Pão sírio, iscas de carne, iscas de frango, cheddar, Doritos, pimentão, creme de alho e batata frita.",
     "v": [
      {
       "n": "",
       "p": 40
      }
     ],
     "foto": "foto-shnachos.webp"
    },
    {
     "id": "shcoracao",
     "name": "Shawarma de Coração",
     "desc": "Pão sírio, iscas de coração, alface americana, tomate, cebola roxa, picles, creme de alho e batata frita.",
     "v": [
      {
       "n": "",
       "p": 40
      }
     ],
     "foto": ""
    }
   ],
   "sub": ""
  },
  {
   "cat": "Porções",
   "items": [
    {
     "id": "batata",
     "name": "Batata frita",
     "desc": "Porção de batata frita sequinha e crocante.",
     "v": [
      {
       "n": "Pequena",
       "p": 14
      },
      {
       "n": "Média",
       "p": 20
      },
      {
       "n": "Grande",
       "p": 24
      }
     ],
     "foto": "foto-batata.webp"
    },
    {
     "id": "batatacb",
     "name": "Batata frita com bacon e cheddar",
     "desc": "Batata frita coberta com bacon em tiras e cheddar.",
     "v": [
      {
       "n": "Pequena",
       "p": 19
      },
      {
       "n": "Média",
       "p": 32
      },
      {
       "n": "Grande",
       "p": 38
      }
     ],
     "foto": "foto-batatacb.webp"
    }
   ],
   "x": false,
   "br": false,
   "sub": "",
   "note": ""
  },
  {
   "cat": "Bebidas",
   "items": [
    {
     "id": "coca200",
     "name": "Coca-Cola 200 ml",
     "desc": "",
     "v": [
      {
       "n": "",
       "p": 3
      }
     ],
     "foto": ""
    },
    {
     "id": "cocalata",
     "name": "Coca-Cola lata",
     "desc": "",
     "v": [
      {
       "n": "",
       "p": 6
      }
     ],
     "foto": ""
    },
    {
     "id": "cocazero",
     "name": "Coca-Cola Zero lata",
     "desc": "",
     "v": [
      {
       "n": "",
       "p": 6
      }
     ],
     "foto": ""
    },
    {
     "id": "coca600",
     "name": "Coca-Cola 600 ml",
     "desc": "",
     "v": [
      {
       "n": "",
       "p": 8
      }
     ],
     "foto": ""
    },
    {
     "id": "coca2l",
     "name": "Coca-Cola 2 L",
     "desc": "",
     "v": [
      {
       "n": "",
       "p": 15
      }
     ],
     "foto": ""
    },
    {
     "id": "guaranalata",
     "name": "Guaraná lata",
     "desc": "",
     "v": [
      {
       "n": "",
       "p": 6
      }
     ],
     "foto": ""
    },
    {
     "id": "guarana600",
     "name": "Guaraná 600 ml",
     "desc": "",
     "v": [
      {
       "n": "",
       "p": 8
      }
     ],
     "foto": ""
    },
    {
     "id": "guarana2l",
     "name": "Guaraná 2 L",
     "desc": "",
     "v": [
      {
       "n": "",
       "p": 15
      }
     ],
     "foto": ""
    },
    {
     "id": "fantauva",
     "name": "Fanta Uva lata",
     "desc": "",
     "v": [
      {
       "n": "",
       "p": 6
      }
     ],
     "foto": ""
    },
    {
     "id": "dvmaca",
     "name": "Dell Vale de Maçã 200 ml",
     "desc": "",
     "v": [
      {
       "n": "",
       "p": 5
      }
     ],
     "foto": ""
    },
    {
     "id": "dvpessego",
     "name": "Dell Vale de Pêssego 200 ml",
     "desc": "",
     "v": [
      {
       "n": "",
       "p": 5
      }
     ],
     "foto": ""
    },
    {
     "id": "dvuva450",
     "name": "Dell Vale Uva 450 ml",
     "desc": "",
     "v": [
      {
       "n": "",
       "p": 6
      }
     ],
     "foto": ""
    },
    {
     "id": "dvuva1l",
     "name": "Dell Vale Uva 1 L",
     "desc": "",
     "v": [
      {
       "n": "",
       "p": 8
      }
     ],
     "foto": ""
    }
   ],
   "x": false,
   "br": false,
   "sub": "",
   "note": ""
  }
 ],
 "adicionais": []
};
ALE.CONFIG_PADRAO={
 "nome": "Ale Top Lanches",
 "whatsapp": "5542991455657",
 "pix": "",
 "retirada": "",
 "zonas": [
  {
   "id": "z1",
   "name": "Centro",
   "fee": null
  },
  {
   "id": "z2",
   "name": "Jardim Brasília",
   "fee": null
  },
  {
   "id": "z3",
   "name": "Jardim Eldorado",
   "fee": null
  },
  {
   "id": "z4",
   "name": "Vila Nova Holanda",
   "fee": null
  },
  {
   "id": "z5",
   "name": "Bela Vista",
   "fee": null
  },
  {
   "id": "z6",
   "name": "Catanduva",
   "fee": null
  },
  {
   "id": "z7",
   "name": "Colônia",
   "fee": null
  },
  {
   "id": "z8",
   "name": "Imigrantes",
   "fee": null
  },
  {
   "id": "z9",
   "name": "Cidade Nova (AFCB)",
   "fee": null
  },
  {
   "id": "z10",
   "name": "Campinho Pequeno",
   "fee": null
  }
 ],
 "promo": {
  "on": true,
  "min": 30
 },
 "destaque": "combosemana",
 "modo": "auto",
 "eta": {
  "base": 30,
  "alto": 40,
  "movimento": false
 }
};
ALE.esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
ALE.BRL=function(n){return Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})};
ALE.hoje=function(){var p=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());return p};
/* Só aceita foto do próprio site (foto-*.webp) ou foto enviada pelo painel (JPEG em base64). */
ALE.fotoOk=function(f){return typeof f==='string'&&(/^[a-z0-9_-]+\.webp$/i.test(f)||/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(f))};
window.ALE=ALE;
})();
