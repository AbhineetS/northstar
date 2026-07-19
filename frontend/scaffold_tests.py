import os
import sys

def scaffold_tests(dir_path):
    test_dir = os.path.join(dir_path, "__tests__")
    os.makedirs(test_dir, exist_ok=True)
    
    for filename in os.listdir(dir_path):
        if filename.endswith(".tsx") and not filename.startswith("__"):
            component_name = filename[:-4]
            test_file = os.path.join(test_dir, f"{component_name}.test.tsx")
            
            if not os.path.exists(test_file):
                content = f"""import React from 'react';
import {{ render, screen }} from '@testing-library/react';
import {{ describe, it, expect }} from 'vitest';
import {{ {component_name} }} from '../{component_name}';

describe('{component_name}', () => {{
  it('renders without crashing', () => {{
    const {{ container }} = render(<{component_name} />);
    expect(container).toBeInTheDocument();
  }});
}});
"""
                with open(test_file, "w") as f:
                    f.write(content)
                print(f"Generated test for {component_name}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        scaffold_tests(sys.argv[1])
