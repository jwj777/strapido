import { Flex, Heading, Container, Image, Text, Link, Icon, Box, UnorderedList, ListItem } from '@chakra-ui/react'
import Header from '/components/header/Header'
import CompanyHeading from '../../components/company/company-header'
import CompanyLinks from '../../components/company/company-links'

export default function Company({ company, features }) {
  return (

    <div>

      <Header />

      <Flex alignItems='center' justifyContent='center'>
        <Container className="main-content" maxW={'7xl'} flex={'1 0 auto'}>

          <CompanyHeading company={company} />

          <Box display="flex">
            <Text fontSize='md' mt={4} mb={8} pr={16}>{company.companyDescription}</Text>
            <CompanyLinks company={company} />
          </Box>

          <Box>
            <Heading as='h2'>Features</Heading>
            {features.map((item, index) => {
              return (
                <Text key={item.attributes.featurename + '__' + index}>{item.attributes.featureName}</Text>
              );
            })}
          </Box>

        </Container>
      </Flex>

    </div>

  )
}


export async function getStaticPaths() {
  const res = await fetch(process.env.API_URL + '/api/companies');
  const resjson = await res.json();
  const companies = resjson.data;

  const paths = companies.map((item, index) => ( {
    params: {slug: item.attributes.slug}
  }));

  return {
    paths,
    fallback: false,
  };

}


export async function getStaticProps({ params }) {
  const { slug } = params;

  const res = await fetch(process.env.API_URL + `/api/companies?filters[slug]=${slug}&populate=*`);
  const res2 = await res.json();
  const res3 = res2.data;
  const company = res3[0].attributes;

  const resfeatures = await fetch(process.env.API_URL + `/api/features?filters[companies][slug][$eq]=${slug}&populate=*`);
  const resfeaturesjson = await resfeatures.json();
  const features = resfeaturesjson.data;

  console.log(features)

  return {
    props: { 
      company,
      features,
     },
  };

}
