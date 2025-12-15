import styled from '@emotion/styled';

import { SkeletonLoader } from '@/activities/components/SkeletonLoader';
import { LinkProductButton } from '@/activities/products/components/LinkProductButton';
import { useDetachProduct } from '@/activities/products/hooks/useDetachProduct';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { RecordChip } from '@/object-record/components/RecordChip';
import { useProducts } from '@/object-record/record-show/hooks/useProducts';
import { useTargetRecord } from '@/ui/layout/contexts/useTargetRecord';
import { Trans } from '@lingui/react/macro';
import { IconTrash } from 'twenty-ui/display';
import { LightIconButton } from 'twenty-ui/input';
import {
    AnimatedPlaceholder,
    AnimatedPlaceholderEmptyContainer,
    AnimatedPlaceholderEmptySubTitle,
    AnimatedPlaceholderEmptyTextContainer,
    AnimatedPlaceholderEmptyTitle,
    EMPTY_PLACEHOLDER_TRANSITION_PROPS
} from 'twenty-ui/layout';

const StyledContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  padding: ${({ theme }) => theme.spacing(6)};
`;

const StyledTitleBar = styled.h3`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  place-items: center;
  width: 100%;
`;

const StyledTitle = styled.span`
  color: ${({ theme }) => theme.font.color.primary};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;

const StyledCount = styled.span`
  color: ${({ theme }) => theme.font.color.light};
  margin-left: ${({ theme }) => theme.spacing(2)};
`;

const StyledProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledProductItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.border.radius.sm};

  &:hover {
    background: ${({ theme }) => theme.background.transparent.lighter};
  }
`;
export const ProductCard = () => {
  const targetRecord = useTargetRecord();

  const { detachProduct } = useDetachProduct({
    targetableObject: targetRecord,
  });

  const { products, loading } = useProducts({
    targetableObject: targetRecord,
  });

  const isProductsEmpty = !products || products.length === 0;

  if (loading && isProductsEmpty) {
    return <SkeletonLoader />;
  }

  if (isProductsEmpty) {
    return (
      <AnimatedPlaceholderEmptyContainer
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...EMPTY_PLACEHOLDER_TRANSITION_PROPS}
      >
        <AnimatedPlaceholder type="noTask" />
        <AnimatedPlaceholderEmptyTextContainer>
          <AnimatedPlaceholderEmptyTitle>
            <Trans>No Products</Trans>
          </AnimatedPlaceholderEmptyTitle>
          <AnimatedPlaceholderEmptySubTitle>

            <Trans>There are no products associated with this record.</Trans>
          </AnimatedPlaceholderEmptySubTitle>
          <LinkProductButton
            targetableObject={targetRecord}
            currentProducts={products}
          />
        </AnimatedPlaceholderEmptyTextContainer>
      </AnimatedPlaceholderEmptyContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledTitleBar>
        <StyledTitle>
          Products <StyledCount>{products.length}</StyledCount>
        </StyledTitle>
        <LinkProductButton
          targetableObject={targetRecord}
          currentProducts={products}
        />
      </StyledTitleBar>
      <StyledProductList>
        {products.map((product: any) => (
          <StyledProductItem key={product.id}>
            <RecordChip
              objectNameSingular={CoreObjectNameSingular.Product}
              record={product}
            />
            {product.associationId && (
              <LightIconButton
                Icon={IconTrash}
                size="small"
                accent="tertiary"
                onClick={() => detachProduct(product.associationId)}
                className="delete-btn"
              />
            )}
          </StyledProductItem>
        ))}
      </StyledProductList>
    </StyledContainer>
  );
};
