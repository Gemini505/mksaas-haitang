'use client';

import {
  addFavoriteAction,
  checkFavoriteAction,
  removeFavoriteAction,
} from '@/actions/favorites';
import { LoginWrapper } from '@/components/auth/login-wrapper';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useLocalePathname } from '@/i18n/navigation';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  workId: number;
  workTitle: string;
  workAuthor: string;
  workDynasty: string;
}

export default function FavoriteButton({
  workId,
  workTitle,
  workAuthor,
  workDynasty,
}: FavoriteButtonProps) {
  const currentPath = useLocalePathname();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    checkFavoriteAction({ workId })
      .then((res) => {
        if (mounted && res?.data?.success) {
          setIsFavorite(!!res?.data?.isFavorite);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [workId, currentUser]);

  const handleClick = () => {
    if (loading || isPending) return;
    startTransition(() => {
      if (isFavorite) {
        removeFavoriteAction({ workId })
          .then((res) => {
            if (res?.data?.success) {
              setIsFavorite(false);
              toast.success('已取消收藏');
            } else {
              toast.error(res?.data?.error || '取消收藏失败');
            }
          })
          .catch(() => toast.error('取消收藏失败'));
      } else {
        addFavoriteAction({
          workId,
          workTitle,
          workAuthor,
          workDynasty,
        })
          .then((res) => {
            if (res?.data?.success) {
              setIsFavorite(true);
              toast.success('已收藏');
            } else {
              toast.error(res?.data?.error || '收藏失败');
            }
          })
          .catch(() => toast.error('收藏失败'));
      }
    });
  };

  return (
    <>
      {currentUser ? (
        <Button
          size="sm"
          className="cursor-pointer text-xs"
          variant={isFavorite ? 'secondary' : 'outline'}
          disabled={loading || isPending}
          onClick={handleClick}
        >
          {loading ? '加载中...' : isFavorite ? '已收藏' : '收藏'}
        </Button>
      ) : (
        <LoginWrapper mode="modal" asChild callbackUrl={currentPath}>
          <Button
            size="sm"
            className="cursor-pointer text-xs"
            disabled={loading || isPending}
          >
            登录并收藏
          </Button>
        </LoginWrapper>
      )}
    </>
  );
}
