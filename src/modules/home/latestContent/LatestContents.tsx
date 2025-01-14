import type { ProtectedDataInCollection } from '@iexec/dataprotector';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { Alert } from '@/components/Alert.tsx';
import { CarouselScrollArrows } from '@/components/CarouselScrollArrows.tsx';
import { CircularLoader } from '@/components/CircularLoader.tsx';
import { getDataProtectorClient } from '@/externals/dataProtectorClient.ts';
import { useUserStore } from '@/stores/user.store.ts';
import { OneContentCard } from './OneContentCard.tsx';

export function LatestContents({
  isRentable,
}: { isRentable?: true | undefined } | undefined = {}) {
  const latestContentRef = useRef<HTMLDivElement>(null);
  const loggedUserAddress = useUserStore().address;
  const { isLoading, isError, error, data } = useQuery<
    ProtectedDataInCollection[],
    unknown
  >({
    queryKey: ['latestContent'],
    queryFn: async () => {
      const { dataProtectorSharing } = await getDataProtectorClient();
      const { protectedDataInCollection } =
        await dataProtectorSharing.getProtectedDataInCollections({
          ...(isRentable !== undefined
            ? { isRentable }
            : { isDistributed: true }),
        });
      return protectedDataInCollection;
    },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="grow text-2xl font-bold">New books ✨📚</h3>
        {!!data?.length && data?.length > 0 && (
          <CarouselScrollArrows
            className="flex-none"
            carousel={latestContentRef}
          />
        )}
      </div>

      {isLoading && (
        <div className="mt-6 flex flex-col items-center gap-y-4">
          <CircularLoader />
        </div>
      )}

      {isError && (
        <Alert variant="error" className="mt-4">
          <p>Oops, something went wrong while fetching books of the week.</p>
          <p className="mt-1 text-sm">{error.toString()}</p>
        </Alert>
      )}

      {data?.length === 0 && (
        <div className="mt-4 flex flex-col items-center gap-y-4">
          No new book? 🤔
        </div>
      )}

      <div
        ref={latestContentRef}
        className="mt-8 inline-flex w-full max-w-full items-stretch gap-x-4 overflow-auto pb-4"
      >
        {!!data?.length &&
          data?.length > 0 &&
          data?.map((protectedData) => (
            <div
              key={protectedData.id}
              className="flex w-[300px] shrink-0 flex-col md:w-[400px]"
            >
              <OneContentCard
                protectedData={protectedData}
                showLockIcon={
                  (protectedData.collection.owner.id !== loggedUserAddress &&
                    protectedData.isRentable &&
                    !protectedData.rentals.some(
                      (rental) =>
                        Number(rental.endDate) * 1000 > Date.now() &&
                        rental.renter === loggedUserAddress
                    )) ||
                  protectedData.isForSale
                }
                linkToDetails="/content/$protectedDataAddress"
              />
            </div>
          ))}
      </div>
    </>
  );
}
