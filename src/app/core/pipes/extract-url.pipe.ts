import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'extractUrl',
    standalone: true
})
export class ExtractUrlPipe implements PipeTransform {
    transform(value: any): string {
        if (!value) return '';
        
        // If it's already a string URL, return it
        if (typeof value === 'string') {
            // Check if it's a stringified SafeValue object
            if (value.includes('unsafe:') || value.includes('"value"')) {
                try {
                    // Extract URL from pattern like: unsafe:{"value":"https://..."}
                    const match = value.match(/"value":"([^"]+)"/);
                    if (match && match[1]) {
                        return match[1];
                    }
                } catch (e) {
                    console.error('Failed to extract URL', e);
                }
            }
            return value;
        }
        
        // If it's an object with value property
        if (typeof value === 'object' && value.value) {
            return value.value;
        }
        
        return value;
    }
}
