import { useRouter } from 'next/router'
import React, { type ComponentProps, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Dashboard from '~/components/layout/dashboard'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { UploadButton } from '~/components/uploadthing/button'
import { Role } from '~/generated/generated'
import { AuthStatus, useAuth } from '~/hooks/useAuth'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Label } from '~/components/ui/label'
import { type UploadRouterEndpoints, uploadRouterEndpoints } from '~/server/uploadthing/router'

const Page = () => {
  const router = useRouter()
  const { user, loading, status } = useAuth()

  if (loading) return <Dashboard><div>Loading...</div></Dashboard>

  if (status === AuthStatus.NOT_AUTHENTICATED || !user || user.role !== Role.Admin) {
    void router.push('/profile')
    return <Dashboard > <div>Redirecting...</div></Dashboard >
  }

  return <InnerPage />
}

const InnerPage = () => {
  const [liveCustomId, setLiveCustomId] = useState<string>("")
  const [liveEndpoint, setLiveEndpoint] = useState<UploadRouterEndpoints[number]>("asset")

  const [dataSet, setDataSet] = useState<boolean>(false);

  const [customId, setCustomId] = useState<string>("")
  const [endpoint, setEndpoint] = useState<UploadRouterEndpoints[number]>("asset")


  const onUploadBegin = useMemo<ComponentProps<typeof UploadButton>["onUploadBegin"]>(() => () => {
    toast.loading('Uploading file...')
  }, [])

  const onClientUploadComplete = useMemo<ComponentProps<typeof UploadButton>["onClientUploadComplete"]>(() => (res) => {
    console.log(res)
    toast.dismiss()
    toast.success('File uploaded successfully')
  }, [])

  const onUploadError = useMemo<ComponentProps<typeof UploadButton>["onUploadError"]>(() => (error) => {
    console.log(error)
    toast.dismiss()
    toast.error(`Error uploading file: ${error.message}`)
  }, [])

  return (
    <Dashboard className='flex justify-center items-center'>
      <div className='flex justify-center items-center size-96 flex-col gap-8 h-[80vh]'>
        <Label>Endpoint</Label>
        <Select
          value={liveEndpoint}
          onValueChange={(value) => setLiveEndpoint(value as UploadRouterEndpoints[number])}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {
              uploadRouterEndpoints.map((ep, idx) => (
                <SelectItem key={idx} value={ep}>{ep}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>

        <Label>File path</Label>
        <Input
          value={liveCustomId}
          onChange={(e) => {
            if (dataSet)
              setDataSet(false)
            setLiveCustomId(e.target.value)
          }}
          placeholder='/dir/sub dir/file.ext' />

        <Label>Set/Unset</Label>
        <Button
          variant={dataSet ? "destructive" : "default"}
          onClick={() => {
            if (liveCustomId.length > 0) {
              const result = new RegExp(/^([\\\/][a-zA-Z0-9\s]+)+.[a-zA-Z0-9]+$/g).test(liveCustomId)
              if (!result) {
                toast.error('Invalid path, example: /dir/subdir/file.ext')
                return
              }
            }
            setDataSet((prev) => !prev)
            setCustomId(liveCustomId)
            setEndpoint(liveEndpoint)
          }
          }>{dataSet ? "Unset" : "Set"} as File Path</Button>

        <div className='border-white/40 border p-4 rounded-md'>
          <UploadButton disabled={!dataSet} endpoint={endpoint} customId={customId}
            onUploadBegin={onUploadBegin}
            onClientUploadComplete={onClientUploadComplete}
            onUploadError={onUploadError}
          />
        </div>
      </div>
    </Dashboard>
  )
}


export default Page
