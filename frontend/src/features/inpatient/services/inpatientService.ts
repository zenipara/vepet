import type { InpatientCase, CaseUpdate, CasePhoto } from '@/types/medical'

export const inpatientService = {
  async getActiveCases(): Promise<InpatientCase[]> {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('inpatient_cases')
      .select(`
        *,
        pets(name, species, photo_url),
        doctors(profiles(full_name))
      `)
      .neq('status', 'discharged')
      .order('admit_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getCaseDetails(caseId: string) {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('inpatient_cases')
      .select(`
        *,
        pets(name, species, photo_url),
        doctors(profiles(full_name)),
        case_updates(*),
        case_photos(*)
      `)
      .eq('id', caseId)
      .single()

    if (error) throw error
    return data
  },

  async addUpdate(caseId: string, payload: {
    stage: string
    title: string
    description: string
    vitals?: Record<string, any>
  }): Promise<CaseUpdate> {
    const { api } = await import('@/lib/apiClient')
    const { data: user } = await api.auth.getUser()

    const { data, error } = await supabase
      .from('case_updates')
      .insert({
        case_id: caseId,
        author_id: user?.user?.id,
        ...payload,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async uploadPhoto(
    caseId: string,
    file: File,
    caption: string
  ): Promise<CasePhoto> {
    const { api } = await import('@/lib/apiClient')
    const { data: user } = await api.auth.getUser()

    const fileName = `${caseId}/${Date.now()}_${file.name}`

    // Upload file
    const { data: uploadData, error: uploadError } = await api.storage
      .from('case-photos')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const publicUrl = uploadData?.public_url || uploadData?.publicUrl || api.storage.from('case-photos').getPublicUrl(fileName).data.publicUrl

    // Save photo record
    const { data: photoRecord, error: saveError } = await supabase
      .from('case_photos')
      .insert({
        case_id: caseId,
        uploader_id: user?.user?.id,
        photo_url: publicUrl,
        caption,
      })
      .select()
      .single()

    if (saveError) throw saveError
    return photoRecord
  },

  async updateCaseStatus(caseId: string, status: string): Promise<void> {
    const { api } = await import('@/lib/apiClient')
    const { error } = await supabase
      .from('inpatient_cases')
      .update({ status })
      .eq('id', caseId)

    if (error) throw error
  },

  async dischargePet(caseId: string): Promise<void> {
    const { api } = await import('@/lib/apiClient')
    const { error } = await supabase
      .from('inpatient_cases')
      .update({
        status: 'discharged',
        discharge_date: new Date().toISOString(),
      })
      .eq('id', caseId)

    if (error) throw error
  },
}
