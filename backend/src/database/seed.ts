import { Product } from "../models/index.js"

const placeholder = "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop"

export const initialProducts = [
  {
    name: "Dolor",
    description: "Acessorio premium para momentos intensos, com acabamento elegante e envio discreto.",
    price: 129.9,
    image: placeholder,
    category: "Acessorios",
    stock: 18,
    popularity: 8
  },
  {
    name: "My Vibrador golfinho",
    description: "Vibrador delicado com design ergonomico, ideal para explorar novas sensacoes com conforto.",
    price: 189.9,
    image: "/assets/products/my-vibrador-golfinho.jfif",
    category: "Vibradores",
    stock: 14,
    popularity: 10
  },
  {
    name: "MyCuff Algema",
    description: "Algema sensual com toque macio, pensada para experiencias seguras e sofisticadas.",
    price: 79.9,
    image: "/assets/products/mycuff-algema.jfif",
    category: "Acessorios",
    stock: 25,
    popularity: 7
  },
  {
    name: "Xana loka",
    description: "Produto divertido para apimentar a rotina com discricao, qualidade e personalidade.",
    price: 69.9,
    image: "/assets/products/xana-loka.jfif",
    category: "Prazer",
    stock: 20,
    popularity: 6
  },
  {
    name: "Magical Kiss",
    description: "Gel beijavel com aroma envolvente e textura suave para momentos mais provocantes.",
    price: 49.9,
    image: "/assets/products/magical-kiss.jfif",
    category: "Cosmeticos",
    stock: 35,
    popularity: 9
  },
  {
    name: "kuloko",
    description: "Item de destaque para casais que querem ousadia com estilo e compra totalmente discreta.",
    price: 99.9,
    image: placeholder,
    category: "Kits",
    stock: 16,
    popularity: 7
  },
  {
    name: "VOLUMAO",
    description: "Cosmetico sensual com proposta marcante, embalagem discreta e experiencia premium.",
    price: 59.9,
    image: placeholder,
    category: "Cosmeticos",
    stock: 30,
    popularity: 8
  },
  {
    name: "HOT BALL",
    description: "Acessorio compacto para intensificar sensacoes com praticidade e acabamento moderno.",
    price: 89.9,
    image: placeholder,
    category: "Acessorios",
    stock: 22,
    popularity: 8
  },
  {
    name: "Sedenta",
    description: "Lubrificante premium com toque confortavel para uso intimo e experiencia refinada.",
    price: 44.9,
    image: placeholder,
    category: "Lubrificantes",
    stock: 40,
    popularity: 9
  },
  {
    name: "Love LUB",
    description: "Lubrificante versatil para casais, com textura leve e entrega em embalagem discreta.",
    price: 39.9,
    image: placeholder,
    category: "Lubrificantes",
    stock: 42,
    popularity: 10
  }
]

export async function seedProducts() {
  await Promise.all(
    initialProducts.map(async product => {
      const matches = await Product.findAll({
        where: { name: product.name },
        order: [["id", "ASC"]]
      })
      const [existing, ...duplicates] = matches

      if(existing) {
        await existing.update(product)

        await Promise.all(
          duplicates.map(duplicate => duplicate.destroy())
        )

        return
      }

      await Product.create(product)
    })
  )
}
