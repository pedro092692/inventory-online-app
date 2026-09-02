import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { Suspense } from 'react'
import Link from 'next/link'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import Admins from '@/app/(admin)/admin/admins/_components/admins'
import { getCurrentUser } from '@/app/utils/getCurrentUser'

export default async function AdminsPage() {
    const userInfo = await getCurrentUser()
    const canManageAdmins = userInfo?.is_super_admin === true

    return (
        <Container
            direction={'column'}
            alignItem={'start'}
            padding='0px'
            width='100%'
            gap='16px'
        >
            {canManageAdmins &&
                <Link href={'/admin/admins/add'}>
                    <Button showIcon={true} type={'secondary'} icon='circlePlus' children='Agregar Administrador'
                        className='p3-r shadow'/>
                </Link>
            }

            {!canManageAdmins &&
                <p className='p2-r'>Solo el super administrador puede agregar nuevos administradores. Puedes ver la lista, pero no modificarla.</p>
            }

            <Suspense fallback={<ListSkeleton nTitle={2} />}>
                <Admins />
            </Suspense>
        </Container>
    )
}
