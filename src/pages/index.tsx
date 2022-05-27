import  { Flex, Button, Stack} from '@chakra-ui/react';
import { Input } from '../components/Form/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';


type SignFormData = {
  email: string;
  password: string;
}

const signInFromSchema = yup.object({
  email: yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigatória'),
});

export default function Home() {
  const { register, handleSubmit, formState} = useForm({
    resolver: yupResolver(signInFromSchema),
  });
  const { errors } = formState;

  const handleSignIn: SubmitHandler<SignFormData> = async (values, event) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('AQUI')
    console.log(values);
  }

  return (
   <Flex 
    h='100vh' 
    w='100vw' 
    align='center' 
    justify='center'
    >
     <Flex
      as='form'
      width='100%'
      maxW={360}
      bg='gray.800'
      p='8'
      borderRadius={8}
      flexDir='column'
      onSubmit={handleSubmit(handleSignIn)}
     >
      <Stack spacing={4}>
        <Input 
          type='email' 
          name='email' 
          label='E-mail'
          error={errors.email}
          {...register('email')}
          />
        <Input 
          type='password' 
          name='password' 
          label='Senha'
          error={errors.password}
          {...register('password')}
        />
      </Stack>

       <Button
        type='submit'
        mt='6'
        colorScheme={'pink'}
        isLoading={formState.isSubmitting}
       >
         Entrar</Button>
     </Flex>
   </Flex>
  )
}
