import { Box, Button, Checkbox, Flex, Heading, Icon, Link, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { useEffect, useState } from "react";

import { RiAddLine, RiPencilLine} from "react-icons/ri";
import { QueryClient } from "react-query";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { getUsers, useUsers } from "../../services/hooks/useUsers";
import { queryClient } from "../../services/queryClient";


export default function UserList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error } = useUsers(page);
  //console.log(query)

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  });

 async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(['user', userId], async () => {
      const response = await api.get(`users/${userId}`)

      return response.data;
    }, {
      staleTime: 1000 * 60 * 10
    })
 }

  return( 
    <Box>
      <Header />

      <Flex w='100%' my='6' maxWidth={1480} mx='auto' px='6'>
          <Sidebar />

          <Box flex='1' borderRadius={8} bg='gray.800' p="8">
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">Usuários</Heading>

              <NextLink href="/users/create" passHref>
                <Button as="a" size='sm' fontSize='sm' colorScheme='pink' leftIcon={<Icon fontSize="20" as={RiAddLine} />}>
                  Criar novo usuário
                  { !isLoading && isFetching && <Spinner  size='sm' color='gray.500' ml='4'/> }
                </Button>
              </NextLink>
            </Flex>

            { isLoading ? (
              <Flex justify='center'>
                <Spinner />
              </Flex>
            ) : error ? (
              <Flex justify='center'>
                <Text>Falha ao obter dados do usuário</Text>
              </Flex>
            ) :         
            (
              <>
              <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr px={['4','4','6']} color='gray.300' width='8'>
                  <Th px={['4','4','6']}>
                    <Checkbox colorScheme='pink'/>
                  </Th>
                  <Th>Usuário</Th>
                 { isWideVersion  && <Th>Data de cadastro</Th> }
                  <Th width='8'></Th>
                </Tr>
              </Thead>
              <Tbody>
               { data.users.map( user => {
                 return(
                  <Tr key={user.id}>
                  <Td px={['4','4','6']}>
                    <Checkbox colorScheme='pink'/>
                  </Td>
                  <Td>
                    <Box>
                      <Link color='purple.400' onMouseEnter={() => handlePrefetchUser(user.id)}>
                        <Text fontWeight='bold'>{user.name}</Text>
                      </Link>
                      <Text fontSize='sm' color='gray.300'>{user.email}</Text>
                    </Box>
                  </Td>
                  { isWideVersion &&   <Td>{user.createdAt}</Td>}
                  <Td>
                  { isWideVersion  
                      ? (<Button as="a" size='sm' fontSize='sm' colorScheme='purple' leftIcon={ <Icon as={RiPencilLine} />}>
                          { isWideVersion ? 'Editar' : '' }
                      </Button> )
                      :( <Button  as="a" size='sm' fontSize='sm' colorScheme='purple'>
                        <Icon as={RiPencilLine}/>
                      </Button>)
                      }
                  </Td>
                </Tr>
                )})}
               
              </Tbody>
            </Table>

            <Pagination 
              totalCountOfRegisters={data.totalCount}
              currentPage={page}
              onPageChange={setPage}
            />
            </>
            )}
          </Box>
      </Flex>
    </Box>
  );
}