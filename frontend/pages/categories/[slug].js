import { Flex, Heading, Box, Image, LinkBox, LinkOverlay, Container, Text, Link } from '@chakra-ui/react'
import Header from '/components/header/Header'
import CompanyItem from '../../components/company-item/company-item'


export default function Category({ category, companies }) {
    return (

      <div>

      <Header />

      <Flex alignItems="center" justifyContent="center">
      <Container className="main-content" maxW={'7xl'} flex={'1 0 auto'}>
        <Box maxW={'4xl'}>
          <Heading as='h1' mb={4}>{category[0].attributes.categoryName}</Heading>
          <Text mb={12}>{category[0].attributes.categoryDescription}</Text>
        </Box>

        <Box className="row-list company-list" flex='1' mb={16}>
        {companies.map((item, index) => {
          return (
            <CompanyItem key={index} company={item} />
          );
        })}
        </Box>

      </Container>

      </Flex>

      </div>

    )
}

export async function getStaticPaths() {

  // get category slugs
  const res = await fetch(process.env.API_URL + `/api/product-categories`);
  const resjson = await res.json();
  const categories = resjson.data;

  const paths = categories.map((item, index) => ( {
    params: {slug: item.attributes.slug}
  }));

  return {
    paths,
    fallback: false,
  };

}

export async function getStaticProps({ params }) {
  const { slug } = params;

  // get category
  const res = await fetch(process.env.API_URL + `/api/product-categories?filters[slug]=${slug}&populate=*`);
  const res2 = await res.json();
  const category = await res2.data;

  // get companies
  const rescompanies = await fetch(process.env.API_URL + `/api/companies?filters[product_categories][slug][$eq]=${slug}&populate=*`);
  const rescompaniesjson = await rescompanies.json();
  const companies = rescompaniesjson.data;

  return {
    props: { 
      companies, 
      category,
    },
    revalidate: 1,
  };
}
