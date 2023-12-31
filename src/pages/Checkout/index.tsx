import { useForm, FormProvider } from 'react-hook-form';
import { Cart } from '../../components/Cart';
import { Form } from '../../components/Form';
import * as S from './styles';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';

const formSchemaData = z.object({
  cep: z.string()
    .min(8, { message: "CEP inválido."})
    .max(8, { message: "CEP inválido."}), 
  address: z.string().min(5, { message: "Endereço inválido." }),
  addressNumber: z.string().min(1, { message: "Número inválido." }),
  complement: z.string().optional(),
  city: z.string().min(5, { message: "Cidade inválida." }),
  state: z.string().min(5, { message: "Estado inválido." }),
  stateUf: z.string().min(2, { message: "UF inválida." }).max(2, { message: "UF inválida." }),
  payment: z.string()
    .refine(value => value === "credit" || "debit" || "cash", { 
      message: "Forma de pagamento inválida." 
  }),
});

export type FormSchemaType = z.infer<typeof formSchemaData>;
export type PaymentMethod = "credit" | "debit" | "cash";

export const Checkout = () => {
  const navigate = useNavigate();
  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(formSchemaData),
  });
  const { resetCart } = useContext(CartContext);

  const { handleSubmit } = methods;
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();

  const handleFormSubmit = (data: FormSchemaType) => {
    navigate('/order', {
      state: {
        data,
        paymentMethod
      }
    });

    resetCart();
  }

  const onSelectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
  }

  return (
    <S.CheckoutContainer>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'flex', gap: '2rem'}}>
          <Form
            paymentMethod={paymentMethod}
            handleSelectPaymentMethod={onSelectPaymentMethod}
          />
          <Cart />
        </form>
      </FormProvider>
    </S.CheckoutContainer>
  );
}