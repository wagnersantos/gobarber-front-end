import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import api from '../../core/provider/api';
import { useToast } from '../../core/hooks/Toast';
import { getValidationErros } from '../../core/utils/getValidationErros';

import Logo from '../../core/assets/images/logo.svg';

import { Button, Input } from '../../components';

import { Container, Content, AnimationContent, Background } from './styled';

interface ForgotPasswordFormDTO {
  email: string;
  password: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormDTO) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/forgot-password', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description:
            'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada',
        });
      } catch (error) {
        /* istanbul ignore else */
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErros(error);

          formRef.current?.setErrors(errors);
        }
      } finally {
        setLoading(false);
      }

      addToast({
        type: 'error',
        title: 'Erro na recuperação de senha',
        description:
          'Ocorreu um erro ao tentar recuperar a senha, tente novamente',
      });
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContent>
          <img src={Logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input
              name="email"
              icon={FiMail}
              type="text"
              placeholder="E-mail"
            />

            <Button type="submit" loading={loading}>
              Recuperar
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContent>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
