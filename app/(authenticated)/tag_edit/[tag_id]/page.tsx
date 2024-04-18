"use client";
import useAuthViewModel from '@/ui/view_models/auth_view_model'
import { useTagViewModel } from '@/ui/view_models/tag_view_model'; 
import { useEditTagViewModel } from '@/ui/view_models/edit_tag_view_model';
import Link from 'next/link';
import { useUserViewModel } from '@/ui/view_models/user_view_model';
import { EditTag } from '@/infrastructure/repository/tag/EditTag';
import { FetchTagByTagId } from '@/infrastructure/repository/tag/FetchTagByTagId';
import { useOnPageLoad } from '@/ui/hooks/useOnPageLoad';
import { useOnPageLeave } from '@/ui/hooks/useOnPageLeave';

export default function EditTagPage({ params }:{ params: { tag_id: string}}) {
  const { token } = useAuthViewModel()
  const id = useUserViewModel(state => state.user.id);
  const { updateTag, getTagByTagId } = useTagViewModel();
  const { tagId, name, setTagId, setName, reset } = useEditTagViewModel();
  // When loading the Tag_edit_page
  const FetchTagByTagIdParams = { 
    tag_id: params.tag_id, 
    getTagByTagId: getTagByTagId, 
    setTagId: setTagId, 
    setName: setName,
  }
  const loadCallbacks = [() => FetchTagByTagId(FetchTagByTagIdParams)]
  useOnPageLoad(loadCallbacks)
  // While on this page
  const EditTagParams = {
    token: token,
    id: id, 
    tag_id: tagId,
    name: name, 
    updateTag: updateTag,
    reset: reset,
  }
  // Whenleavin the tag_edit_page
  const leaveCallbacks = [() => reset()];
  useOnPageLeave(leaveCallbacks);
  
  return (
    <div>
      <h1 className='text-xl font-bold mb-4'>編集ページ</h1>
      <input
        type="text"
        className='form-input mt-1 block w-full p-2 border border-gray-300 rounded-md'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => EditTag(EditTagParams)}>Edit Tag</button>
      <Link href={"./"}><button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">リスト一覧</button></Link>
    </div>
  );
}
