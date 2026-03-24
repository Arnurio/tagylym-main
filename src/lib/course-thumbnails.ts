export function getCourseThumbnail(category: string): string {
    const c = (category || '').toLowerCase()
    if (c.includes('robot-design') || c.includes('building') || c.includes('конструир'))
        return '/images/thumb-fll-robot.jpg'
    if (c.includes('coding') || c.includes('программир'))
        return '/images/thumb-fll-coding.jpg'
    if (c.includes('core-values') || c.includes('core values') || c.includes('құндылық'))
        return '/images/thumb-fll-robot.jpg'
    if (c.includes('innovation') || c.includes('инновац') || c.includes('жоба'))
        return '/images/thumb-cad.jpg'
    if (c.includes('cad') || c.includes('design'))
        return '/images/thumb-cad.jpg'
    if (c.includes('ftc') && c.includes('build'))
        return '/images/thumb-fll-robot.jpg'
    if (c.includes('inspire'))
        return '/images/thumb-cad.jpg'
    return '/images/thumb-fll-robot.jpg'
}
