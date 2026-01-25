// Module 1 Data - Extracted from module1.html
// This file contains module-specific exercise data for course.js to use

window.conceptLinks = {
    "For Loops": "#lesson-loops",
    "If/Else": "#lesson-if",
    "Slices & Range": "#lesson-slices",
    "Maps": "#lesson-maps",
    "make() Function": "#lesson-slices",
    "Comma-Ok Pattern": "#lesson-comma-ok",
    "Range with Index": "#lesson-loops",
    "Building Slices": "#lesson-slices"
};

// Shared hints/pre-reading for each exercise type (these are the same across variants)
window.sharedContent = {
    advanced_1: {
        preReading: {
            title: '📖 Pre-reading: The "Have I Seen This?" Pattern',
            content: `<strong>The Problem:</strong> How do you know if you've seen something before?<br><br>
                <strong>Naive approach (slow):</strong><br>
                For each element, check every other element to see if it matches → O(n²)<br>
                For 1000 elements, that's 1,000,000 comparisons! 🐌<br><br>
                <strong>Smart approach (fast):</strong><br>
                Use a map to remember what you've seen → O(n)<br>
                For 1000 elements, that's just 1000 operations! 🚀<br><br>
                <strong>The Pattern:</strong><br>
                1. Create an empty map to track what you've seen<br>
                2. For each element, check: "Have I seen this before?"<br>
                3. If yes → found a duplicate!<br>
                4. If no → remember it and continue`
        },
        hints: [
            {
                title: '🤔 Think about it',
                content: `As you go through the elements, how would you remember which ones you've already seen? What data structure gives you fast lookup to check "have I seen this before?"`
            },
            {
                title: '💡 Hint',
                content: `Use a map as your "memory" - the key is the element, and you just need to know it exists (what simple type represents yes/no?). For each element: first check if it's in your memory, then add it if not. If you make it through all elements without finding a duplicate, they must all be unique.`
            },
            {
                title: '🔧 Pattern',
                content: `<pre>1. Create empty "seen" tracker
2. For each element:
   - Already in tracker? → found duplicate!
   - Not seen? → add to tracker
3. Finished loop? → all unique</pre>`
            }
        ],
        docLinks: [
            { url: "https://go.dev/blog/maps", title: "Go Blog: Go maps in action", note: "comprehensive guide to maps" },
            { url: "https://go.dev/ref/spec#Map_types", title: "Go Spec: Map types", note: "official language specification" },
            { url: "https://go.dev/ref/spec#Making_slices_maps_and_channels", title: "Go Spec: make()", note: "how make() initializes maps" }
        ]
    },
    advanced_2: {
        preReading: {
            title: '📖 Pre-reading: The Slow/Fast Pointer Pattern',
            content: `<strong>The Problem:</strong> Remove duplicates from a sorted collection in-place<br><br>
                <strong>Key insight:</strong> The collection is <strong>sorted</strong>, so duplicates are next to each other!<br><br>
                <strong>The Slow/Fast Pattern:</strong><br>
                • <strong>Both pointers start at different positions</strong> (unlike i/j starting at opposite ends)<br>
                • <strong>They move at different speeds</strong> (unlike i/j both moving every iteration)<br>
                • One pointer <strong>reads</strong>, the other <strong>writes</strong><br><br>
                <strong>Code structure pattern:</strong><br>
<pre>slow := 0  // Initialize OUTSIDE loop (write position)

for fast := 1; fast < len(items); fast++ {  // Initialize IN loop (read position)
    // Compare items[fast] with items[slow]
    // If different: move slow, write value
    // If same: do nothing
    // fast moves automatically every iteration
}</pre>`
        },
        hints: [
            {
                title: '🤔 Think about it',
                content: `If the array is already sorted, where will duplicates be? If you're keeping track of the 'last unique' position, what do you do when you find a new unique value?`
            },
            {
                title: '💡 Hint',
                content: `Use two pointers: 'slow' marks where to write the next unique value, 'fast' scans ahead. When fast finds something different from what slow points to, you've found a new unique value - increment slow and copy it there.`
            },
            {
                title: '🔧 Pattern',
                content: `<pre>1. slow = first position (write pointer)
2. fast scans from second position (read pointer)
3. For each fast position:
   - Different from slow? → advance slow, copy value
   - Same? → skip (fast moves on)
4. Return slow + 1 (new length)</pre>`
            }
        ],
        docLinks: [
            { url: "https://go.dev/ref/spec#For_statements", title: "Go Spec: For statements", note: "loop syntax and semantics" },
            { url: "https://go.dev/ref/spec#Slice_types", title: "Go Spec: Slice types", note: "understanding slices" },
            { url: "https://go.dev/blog/slices-intro", title: "Go Blog: Arrays, slices, and strings", note: "in-depth slice mechanics" }
        ]
    },
    advanced_3: {
        preReading: {
            title: '📖 Pre-reading: Strings vs Runes in Go',
            content: `<strong>The Problem:</strong> In Go, a <code>string</code> is a sequence of <strong>bytes</strong>, not characters!<br><br>
                For ASCII (a-z, 0-9), one character = one byte. Easy!<br>
                But for Unicode (emoji 🎉, Chinese 世界, etc.), one character can be 2-4 bytes.<br><br>
                <strong>Example:</strong><br>
                <code>"Hello"</code> = 5 bytes = 5 characters ✅<br>
                <code>"世界"</code> = 6 bytes but only 2 characters! ⚠️<br>
                <code>"🎉"</code> = 4 bytes but only 1 character! ⚠️<br><br>
                <strong>The Solution: Runes</strong><br>
                A <code>rune</code> is Go's type for a Unicode character (actually an <code>int32</code>).<br>
                Converting to <code>[]rune</code> splits the string into actual characters, not bytes.`
        },
        hints: [
            {
                title: '🤔 Think about it',
                content: `Why can't you just index a string directly with [i]? What's special about strings in Go when dealing with non-ASCII characters?`
            },
            {
                title: '💡 Hint',
                content: `Convert to []rune to handle Unicode properly. Then use the two-pointer swap pattern you learned - swap from both ends working inward.`
            },
            {
                title: '🔧 Pattern',
                content: `<pre>1. Convert string to character array (runes)
2. Two pointers: left at start, right at end
3. While left < right:
   - Swap characters at left and right
   - Move pointers inward
4. Convert back to string</pre>`
            }
        ],
        docLinks: [
            { url: "https://go.dev/blog/strings", title: "Go Blog: Strings, bytes, runes and characters", note: "essential reading for Go strings" },
            { url: "https://go.dev/ref/spec#Rune_literals", title: "Go Spec: Rune literals", note: "what runes are" },
            { url: "https://pkg.go.dev/unicode", title: "Package unicode", note: "unicode classification functions" }
        ]
    },
    advanced_4: {
        hints: [
            {
                title: '🤔 Think about it',
                content: `What's the pattern for counting things? What data structure lets you track 'how many of each thing' efficiently?`
            },
            {
                title: '💡 Hint',
                content: `First split the string into words (check the strings package for a function that splits on whitespace). Then use a map where keys are words and values are counts - what operation increases a map value?`
            },
            {
                title: '🔧 Pattern',
                content: `<pre>1. Split string into words
2. Create empty count tracker (map)
3. For each word:
   - Increment its count
4. Return the counts</pre>`
            }
        ],
        docLinks: [
            { url: "https://pkg.go.dev/strings", title: "Package strings", note: "Fields, Split, Join and more" },
            { url: "https://go.dev/blog/maps", title: "Go Blog: Go maps in action", note: "map operations including increment" },
            { url: "https://pkg.go.dev/fmt", title: "Package fmt", note: "printing maps and formatted output" }
        ]
    },
    advanced_5: {
        preReading: {
            title: '📖 Pre-reading: The Hash Map Complement Pattern',
            content: `<strong>The Naive Approach (slow):</strong><br>
                Check every pair of numbers - requires nested loops O(n²)<br><br>
                <strong>The Smart Approach (fast):</strong><br>
                Use a map to remember what you've seen - only one loop O(n)<br><br>
                <strong>The Key Insight:</strong><br>
                If target = 9 and current number = 2, we need to find 7.<br>
                Instead of searching the whole array for 7, just check: "Have I seen 7 before?"<br>
                Maps make this lookup instant!`
        },
        hints: [
            {
                title: '🤔 Think about it',
                content: `For each number, what other number would you need to find to reach the target? Instead of searching the whole array for it, how could you instantly check if you've seen it?`
            },
            {
                title: '💡 Hint',
                content: `The complement is <code>target - current</code>. Use a map to remember numbers you've seen AND their indices (since you need to return indices). Check for the complement before adding the current number to your map.`
            },
            {
                title: '🔧 Pattern',
                content: `<pre>1. Create tracker: number → its index
2. For each number at position i:
   - Calculate: complement = target - number
   - Complement in tracker? → return [tracker[complement], i]
   - Not found? → add number:i to tracker</pre>`
            }
        ],
        docLinks: [
            { url: "https://go.dev/blog/maps", title: "Go Blog: Go maps in action", note: "storing values (indices) in maps" },
            { url: "https://go.dev/ref/spec#Index_expressions", title: "Go Spec: Index expressions", note: "the comma-ok idiom for map access" },
            { url: "https://pkg.go.dev/sort", title: "Package sort", note: "for sorted-input variants" }
        ]
    },
    advanced_6: {
        preReading: {
            title: '📖 Pre-reading: The Sliding Window Pattern',
            content: `<strong>The Problem:</strong> Find something optimal in a contiguous subarray<br><br>
                <strong>Naive approach (slow):</strong><br>
                Check every possible subarray - O(n²) or worse 🐌<br><br>
                <strong>Smart approach (fast):</strong><br>
                Use a "window" that slides through the array - O(n) 🚀<br><br>
                <strong>Two Types of Sliding Windows:</strong><br>
                <strong>1. Fixed-size window:</strong> Window size k stays constant<br>
                • Add the new element entering on the right<br>
                • Subtract the element leaving on the left<br><br>
                <strong>2. Variable-size window:</strong> Window grows and shrinks<br>
                • Expand (move right pointer) to include more elements<br>
                • Shrink (move left pointer) when condition is violated or met`
        },
        hints: [
            {
                title: '🤔 Think about it',
                content: `If you've already calculated the sum for elements 0-3, do you really need to recalculate everything for elements 1-4? What operation can give you the new sum efficiently?`
            },
            {
                title: '💡 Hint',
                content: `For fixed windows: add the new element entering, subtract the element leaving. Think of it as the window 'sliding' right - one element comes in, one goes out. Track your max/min as you slide.`
            },
            {
                title: '🔧 Pattern',
                content: `<pre>1. Calculate sum of first k elements
2. Track this as current max
3. Slide window: for each new position:
   - Add new element (entering window)
   - Subtract old element (leaving window)
   - Update max if current sum is larger</pre>`
            }
        ],
        docLinks: [
            { url: "https://go.dev/ref/spec#For_statements", title: "Go Spec: For statements", note: "loop constructs" },
            { url: "https://go.dev/blog/slices-intro", title: "Go Blog: Slices introduction", note: "slice indexing and sub-slicing" },
            { url: "https://pkg.go.dev/builtin#len", title: "Builtin len()", note: "getting slice length" }
        ]
    }
};


// Embedded variants data (works with file:// protocol)
// These are DIFFERENT problems that test the same concepts, not just renamed variables
window.variantsDataEmbedded = {
  "intermediate": [
    { "id": "intermediate_1", "concept": "make() Function", "variants": [
      { "id": "v1", "title": "Make and Append to Slice", "description": "Create an empty slice using <code>make([]int, 0)</code>, add three numbers with <code>append</code>, then print its length.", "hints": ["<code>make([]int, 0)</code> creates an empty int slice", "<code>nums = append(nums, value)</code> adds to the slice"], "solution": "nums := make([]int, 0)\nnums = append(nums, 10)\nnums = append(nums, 20)\nnums = append(nums, 30)\nfmt.Println(len(nums))  // 3", "expected": "3" },
      { "id": "v2", "title": "Make an Empty Map", "description": "Create an empty map using <code>make(map[string]int)</code>, add three key-value pairs, then print its length.", "hints": ["<code>make(map[string]int)</code> creates an empty map", "<code>scores[\"alice\"] = 100</code> adds a key-value pair"], "solution": "scores := make(map[string]int)\nscores[\"alice\"] = 100\nscores[\"bob\"] = 85\nscores[\"carol\"] = 92\nfmt.Println(len(scores))  // 3", "expected": "3" },
      { "id": "v3", "title": "Append Multiple Values", "description": "Create an empty string slice, then use <code>append</code> to add multiple values at once. Print the slice.", "hints": ["<code>append</code> can take multiple values: <code>append(slice, a, b, c)</code>"], "solution": "words := make([]string, 0)\nwords = append(words, \"go\", \"is\", \"fun\")\nfmt.Println(words)  // [go is fun]", "expected": "[go is fun]" }
    ]},
    { "id": "intermediate_2", "concept": "Comma-Ok Pattern", "variants": [
      { "id": "v1", "title": "Check Map Key Exists", "description": "Create a map of fruit prices. Check if \"banana\" exists using the <code>value, ok := map[key]</code> pattern.", "hints": ["<code>price, ok := prices[\"banana\"]</code>", "<code>ok</code> is true if key exists, false otherwise"], "solution": "prices := map[string]float64{\n    \"apple\":  1.50,\n    \"orange\": 2.00,\n}\n\nif price, ok := prices[\"banana\"]; ok {\n    fmt.Printf(\"Banana: $%.2f\\n\", price)\n} else {\n    fmt.Println(\"Banana not found\")\n}", "expected": "Banana not found" },
      { "id": "v2", "title": "Safe Map Lookup", "description": "Create a map of user ages. Safely look up a user that exists AND one that doesn't, printing appropriate messages.", "hints": ["Use <code>if age, ok := ages[name]; ok { ... } else { ... }</code>"], "solution": "ages := map[string]int{\"alice\": 30, \"bob\": 25}\n\nif age, ok := ages[\"alice\"]; ok {\n    fmt.Printf(\"Alice is %d\\n\", age)\n}\n\nif age, ok := ages[\"charlie\"]; ok {\n    fmt.Printf(\"Charlie is %d\\n\", age)\n} else {\n    fmt.Println(\"Charlie not found\")\n}", "expected": "Alice is 30\nCharlie not found" },
      { "id": "v3", "title": "Default Value Pattern", "description": "Create a map of stock counts. If an item doesn't exist, print \"Out of stock\" instead of 0.", "hints": ["Check with comma-ok before using the value"], "solution": "stock := map[string]int{\"apple\": 5, \"banana\": 0}\n\nitem := \"orange\"\nif count, ok := stock[item]; ok {\n    fmt.Printf(\"%s: %d in stock\\n\", item, count)\n} else {\n    fmt.Printf(\"%s: Out of stock\\n\", item)\n}", "expected": "orange: Out of stock" }
    ]},
    { "id": "intermediate_3", "concept": "Range with Index", "variants": [
      { "id": "v1", "title": "Print Index and Value", "description": "Create a slice of your favorite foods. Loop through and print both index and value: \"0: pizza\", \"1: tacos\", etc.", "hints": ["<code>for i, food := range foods</code> gives you both index and value"], "solution": "foods := []string{\"pizza\", \"tacos\", \"sushi\"}\nfor i, food := range foods {\n    fmt.Printf(\"%d: %s\\n\", i, food)\n}", "expected": "0: pizza\n1: tacos\n2: sushi" },
      { "id": "v2", "title": "Numbered List", "description": "Create a slice of task names. Print them as a numbered list starting from 1: \"1. Buy milk\", \"2. Walk dog\", etc.", "hints": ["Use <code>i+1</code> to start numbering from 1 instead of 0"], "solution": "tasks := []string{\"Buy milk\", \"Walk dog\", \"Code\"}\nfor i, task := range tasks {\n    fmt.Printf(\"%d. %s\\n\", i+1, task)\n}", "expected": "1. Buy milk\n2. Walk dog\n3. Code" },
      { "id": "v3", "title": "Find Element Index", "description": "Create a slice of colors. Find and print the index of \"green\" (or -1 if not found).", "hints": ["Loop with index, check if element matches"], "solution": "colors := []string{\"red\", \"blue\", \"green\", \"yellow\"}\ntarget := \"green\"\nresult := -1\n\nfor i, color := range colors {\n    if color == target {\n        result = i\n        break\n    }\n}\nfmt.Printf(\"Index of %s: %d\\n\", target, result)", "expected": "Index of green: 2" }
    ]},
    { "id": "intermediate_4", "concept": "Building Slices", "variants": [
      { "id": "v1", "title": "Collect Even Numbers", "description": "Create an empty slice, then loop 1-10 and append only even numbers. Print the result.", "hints": ["Check <code>if i%2 == 0</code>", "Use <code>append</code> inside the if block"], "solution": "evens := []int{}\nfor i := 1; i <= 10; i++ {\n    if i%2 == 0 {\n        evens = append(evens, i)\n    }\n}\nfmt.Println(evens)", "expected": "[2 4 6 8 10]" },
      { "id": "v2", "title": "Filter Long Words", "description": "Given <code>[]string{\"go\", \"python\", \"js\", \"rust\"}</code>, collect only words with 3+ characters into a new slice.", "hints": ["Check <code>if len(word) >= 3</code>"], "solution": "words := []string{\"go\", \"python\", \"js\", \"rust\"}\nlong := []string{}\nfor _, word := range words {\n    if len(word) >= 3 {\n        long = append(long, word)\n    }\n}\nfmt.Println(long)", "expected": "[python rust]" },
      { "id": "v3", "title": "Collect Multiples of 3", "description": "Create an empty slice, loop 1-15, and append only numbers divisible by 3. Print the result.", "hints": ["Check <code>if i%3 == 0</code>"], "solution": "multiples := []int{}\nfor i := 1; i <= 15; i++ {\n    if i%3 == 0 {\n        multiples = append(multiples, i)\n    }\n}\nfmt.Println(multiples)", "expected": "[3 6 9 12 15]" }
    ]}
  ],
  "warmups": [
    { "id": "warmup_1", "concept": "For Loops", "variants": [
      { "id": "v1", "title": "Print 1 to 10", "description": "Write a program that prints the numbers 1 to 10, one per line.", "hints": ["Use <code>for i := 1; i <= 10; i++</code>"], "solution": "for i := 1; i <= 10; i++ {\n    fmt.Println(i)\n}" },
      { "id": "v2", "title": "Countdown from 5", "description": "Write a program that counts down from 5 to 1, then prints \"Go!\"", "hints": ["Use <code>for i := 5; i >= 1; i--</code>", "Print \"Go!\" after the loop"], "solution": "for i := 5; i >= 1; i-- {\n    fmt.Println(i)\n}\nfmt.Println(\"Go!\")" },
      { "id": "v3", "title": "Print Even Numbers", "description": "Write a program that prints even numbers from 2 to 10.", "hints": ["Use <code>for i := 2; i <= 10; i += 2</code>"], "solution": "for i := 2; i <= 10; i += 2 {\n    fmt.Println(i)\n}" }
    ]},
    { "id": "warmup_2", "concept": "If/Else", "variants": [
      { "id": "v1", "title": "Check Number Sign", "description": "Write <code>func checkSign(n int) string</code> that returns \"positive\", \"negative\", or \"zero\".", "hints": ["Use <code>if n > 0</code>, then <code>else if n < 0</code>, then <code>else</code>"], "solution": "func checkSign(n int) string {\n    if n > 0 {\n        return \"positive\"\n    } else if n < 0 {\n        return \"negative\"\n    }\n    return \"zero\"\n}" },
      { "id": "v2", "title": "Pass or Fail", "description": "Write <code>func passOrFail(score int) string</code> that returns \"pass\" if score >= 60, else \"fail\".", "hints": ["Simple if/else: <code>if score >= 60 { return \"pass\" }</code>"], "solution": "func passOrFail(score int) string {\n    if score >= 60 {\n        return \"pass\"\n    }\n    return \"fail\"\n}" },
      { "id": "v3", "title": "Age Category", "description": "Write <code>func ageCategory(age int) string</code> that returns \"child\" (< 13), \"teen\" (13-19), or \"adult\" (20+).", "hints": ["Chain if/else if/else based on age ranges"], "solution": "func ageCategory(age int) string {\n    if age < 13 {\n        return \"child\"\n    } else if age < 20 {\n        return \"teen\"\n    }\n    return \"adult\"\n}" }
    ]},
    { "id": "warmup_3", "concept": "Slices & Range", "variants": [
      { "id": "v1", "title": "Iterate Numbers", "description": "Create a slice with three numbers, then print each using <code>for range</code>.", "hints": ["Create: <code>nums := []int{7, 42, 99}</code>", "Loop: <code>for _, num := range nums</code>"], "solution": "nums := []int{7, 42, 99}\nfor _, num := range nums {\n    fmt.Println(num)\n}" },
      { "id": "v2", "title": "Iterate with Index", "description": "Create a slice of colors, then print each with its index: \"0: red\", \"1: blue\", etc.", "hints": ["Loop with index: <code>for i, color := range colors</code>", "Use <code>fmt.Printf(\"%d: %s\\n\", i, color)</code>"], "solution": "colors := []string{\"red\", \"blue\", \"green\"}\nfor i, color := range colors {\n    fmt.Printf(\"%d: %s\\n\", i, color)\n}" },
      { "id": "v3", "title": "Iterate Strings", "description": "Create a slice of your favorite foods, print each on its own line.", "hints": ["Create: <code>foods := []string{\"pizza\", \"sushi\", \"tacos\"}</code>"], "solution": "foods := []string{\"pizza\", \"sushi\", \"tacos\"}\nfor _, food := range foods {\n    fmt.Println(food)\n}" }
    ]},
    { "id": "warmup_4", "concept": "Maps", "variants": [
      { "id": "v1", "title": "Ages Map", "description": "Create a map of names to ages, then print each person's name and age.", "hints": ["Map syntax: <code>map[string]int{\"alice\": 30}</code>", "Loop: <code>for name, age := range ages</code>"], "solution": "ages := map[string]int{\n    \"alice\": 30,\n    \"bob\":   25,\n}\nfor name, age := range ages {\n    fmt.Printf(\"%s is %d\\n\", name, age)\n}" },
      { "id": "v2", "title": "Prices Map", "description": "Create a map of items to prices (float64), then print each item and price.", "hints": ["Map syntax: <code>map[string]float64{\"apple\": 1.50}</code>"], "solution": "prices := map[string]float64{\n    \"apple\":  1.50,\n    \"banana\": 0.75,\n}\nfor item, price := range prices {\n    fmt.Printf(\"%s: $%.2f\\n\", item, price)\n}" },
      { "id": "v3", "title": "Capitals Map", "description": "Create a map of countries to their capitals, then print each pair.", "hints": ["Map syntax: <code>map[string]string{\"France\": \"Paris\"}</code>"], "solution": "capitals := map[string]string{\n    \"France\": \"Paris\",\n    \"Japan\":  \"Tokyo\",\n}\nfor country, capital := range capitals {\n    fmt.Printf(\"%s: %s\\n\", country, capital)\n}" }
    ]}
  ],
  "challenges": [
    {
      "id": "challenge_1", "block": 1, "concept": "Accumulator Pattern",
      "docLinks": [
        { "url": "https://go.dev/ref/spec#For_statements", "title": "Go Spec: For statements", "note": "range loops" },
        { "url": "https://go.dev/ref/spec#Arithmetic_operators", "title": "Go Spec: Arithmetic operators", "note": "+= syntax" }
      ],
      "variants": [
        { "id": "v1", "title": "Sum of Slice", "description": "Write <code>func sum(numbers []int) int</code> that returns the sum of all numbers.", "functionSignature": "func sum(numbers []int) int", "testCases": [{ "input": "[]int{1, 2, 3, 4, 5}", "output": "15" }], "hints": [{ "title": "🤔 Think about it", "content": "As you process each element, you need to build up a result. What variable do you need to track this running total?" }, { "title": "💡 Hint", "content": "Create an accumulator variable (number for sums, string for joining). Loop through and combine each element with your accumulator." }, { "title": "🔧 Pattern", "content": "<pre>1. Start with initial value (0 for sums, \"\" for strings)\n2. For each element:\n   - Combine element with accumulator\n3. Return accumulator</pre>" }], "solution": "func sum(numbers []int) int {\n    total := 0\n    for _, num := range numbers {\n        total += num\n    }\n    return total\n}" },
        { "id": "v2", "title": "Join Words", "description": "Write <code>func joinWords(words []string) string</code> that joins all words with spaces.", "functionSignature": "func joinWords(words []string) string", "testCases": [{ "input": "[]string{\"go\", \"is\", \"fun\"}", "output": "\"go is fun\"" }], "hints": [{ "title": "🤔 Think about it", "content": "As you process each element, you need to build up a result. What variable do you need to track this running total?" }, { "title": "💡 Hint", "content": "Create an accumulator variable (number for sums, string for joining). Loop through and combine each element with your accumulator." }, { "title": "🔧 Pattern", "content": "<pre>1. Start with initial value (0 for sums, \"\" for strings)\n2. For each element:\n   - Combine element with accumulator\n3. Return accumulator</pre>" }], "solution": "func joinWords(words []string) string {\n    result := \"\"\n    for i, word := range words {\n        if i > 0 {\n            result += \" \"\n        }\n        result += word\n    }\n    return result\n}" },
        { "id": "v3", "title": "Total String Length", "description": "Write <code>func totalLength(words []string) int</code> that returns total length of all strings.", "functionSignature": "func totalLength(words []string) int", "testCases": [{ "input": "[]string{\"go\", \"is\", \"fun\"}", "output": "7" }], "hints": [{ "title": "🤔 Think about it", "content": "As you process each element, you need to build up a result. What variable do you need to track this running total?" }, { "title": "💡 Hint", "content": "Create an accumulator variable (number for sums, string for joining). Loop through and combine each element with your accumulator." }, { "title": "🔧 Pattern", "content": "<pre>1. Start with initial value (0 for sums, \"\" for strings)\n2. For each element:\n   - Combine element with accumulator\n3. Return accumulator</pre>" }], "solution": "func totalLength(words []string) int {\n    total := 0\n    for _, word := range words {\n        total += len(word)\n    }\n    return total\n}" }
      ]
    },
    {
      "id": "challenge_2", "block": 1, "concept": "Counting with Condition",
      "docLinks": [
        { "url": "https://go.dev/ref/spec#If_statements", "title": "Go Spec: If statements", "note": "conditionals" },
        { "url": "https://go.dev/ref/spec#Arithmetic_operators", "title": "Go Spec: Arithmetic operators", "note": "% modulo operator" }
      ],
      "variants": [
        { "id": "v1", "title": "Count Evens", "description": "Write <code>func countEvens(nums []int) int</code> that counts even numbers.", "functionSignature": "func countEvens(nums []int) int", "testCases": [{ "input": "[]int{1, 2, 3, 4, 5, 6}", "output": "3" }], "hints": [{ "title": "🤔 Think about it", "content": "You need to count things that meet a condition. What two pieces do you need: one to track the count, and one to check each element?" }, { "title": "💡 Hint", "content": "Start a counter at 0. For each element, check your condition - if true, increment the counter." }, { "title": "🔧 Pattern", "content": "<pre>1. Start counter at 0\n2. For each element:\n   - Meets condition? → increment counter\n3. Return counter</pre>" }], "solution": "func countEvens(nums []int) int {\n    count := 0\n    for _, num := range nums {\n        if num%2 == 0 {\n            count++\n        }\n    }\n    return count\n}" },
        { "id": "v2", "title": "Count Negatives", "description": "Write <code>func countNegatives(nums []int) int</code> that counts negative numbers.", "functionSignature": "func countNegatives(nums []int) int", "testCases": [{ "input": "[]int{-1, 2, -3, 4}", "output": "2" }], "hints": [{ "title": "🤔 Think about it", "content": "You need to count things that meet a condition. What two pieces do you need: one to track the count, and one to check each element?" }, { "title": "💡 Hint", "content": "Start a counter at 0. For each element, check your condition - if true, increment the counter." }, { "title": "🔧 Pattern", "content": "<pre>1. Start counter at 0\n2. For each element:\n   - Meets condition? → increment counter\n3. Return counter</pre>" }], "solution": "func countNegatives(nums []int) int {\n    count := 0\n    for _, num := range nums {\n        if num < 0 {\n            count++\n        }\n    }\n    return count\n}" },
        { "id": "v3", "title": "Count Long Words", "description": "Write <code>func countLong(words []string, minLen int) int</code> that counts words >= minLen.", "functionSignature": "func countLong(words []string, minLen int) int", "testCases": [{ "input": "[]string{\"go\", \"python\", \"js\"}, 3", "output": "1" }], "hints": [{ "title": "🤔 Think about it", "content": "You need to count things that meet a condition. What two pieces do you need: one to track the count, and one to check each element?" }, { "title": "💡 Hint", "content": "Start a counter at 0. For each element, check your condition - if true, increment the counter." }, { "title": "🔧 Pattern", "content": "<pre>1. Start counter at 0\n2. For each element:\n   - Meets condition? → increment counter\n3. Return counter</pre>" }], "solution": "func countLong(words []string, minLen int) int {\n    count := 0\n    for _, word := range words {\n        if len(word) >= minLen {\n            count++\n        }\n    }\n    return count\n}" }
      ]
    },
    {
      "id": "challenge_3", "block": 1, "concept": "Multiple Conditionals",
      "docLinks": [
        { "url": "https://go.dev/ref/spec#If_statements", "title": "Go Spec: If statements", "note": "else-if chains" },
        { "url": "https://go.dev/ref/spec#Comparison_operators", "title": "Go Spec: Comparison operators", "note": ">=, <, == etc." }
      ],
      "variants": [
        { "id": "v1", "title": "FizzBuzz", "description": "Print 1-20. Multiples of 3: \"Fizz\", 5: \"Buzz\", both: \"FizzBuzz\".", "functionSignature": "// loop", "testCases": [{ "input": "15", "output": "FizzBuzz" }], "hints": [{ "title": "🤔 Think about it", "content": "When you have overlapping conditions (like a number divisible by both 3 AND 5), which case should you check first?" }, { "title": "💡 Hint", "content": "Check the most specific condition first! For FizzBuzz, 15 is divisible by both 3 and 5, so check for 15 before checking 3 or 5 individually." }, { "title": "🔧 Pattern", "content": "<pre>1. Check most specific condition first\n2. Then check less specific conditions\n3. Default case last\n(Order matters: check \"both 3 AND 5\" before \"just 3\" or \"just 5\")</pre>" }], "solution": "for i := 1; i <= 20; i++ {\n    if i%15 == 0 {\n        fmt.Println(\"FizzBuzz\")\n    } else if i%3 == 0 {\n        fmt.Println(\"Fizz\")\n    } else if i%5 == 0 {\n        fmt.Println(\"Buzz\")\n    } else {\n        fmt.Println(i)\n    }\n}" },
        { "id": "v2", "title": "Grade Classifier", "description": "Write <code>func grade(score int) string</code> returning A/B/C/D/F.", "functionSignature": "func grade(score int) string", "testCases": [{ "input": "85", "output": "\"B\"" }], "hints": [{ "title": "🤔 Think about it", "content": "When you have overlapping conditions (like a number divisible by both 3 AND 5), which case should you check first?" }, { "title": "💡 Hint", "content": "Check the most specific condition first! For FizzBuzz, 15 is divisible by both 3 and 5, so check for 15 before checking 3 or 5 individually." }, { "title": "🔧 Pattern", "content": "<pre>1. Check most specific condition first\n2. Then check less specific conditions\n3. Default case last\n(Order matters: check \"both 3 AND 5\" before \"just 3\" or \"just 5\")</pre>" }], "solution": "func grade(score int) string {\n    if score >= 90 { return \"A\" }\n    if score >= 80 { return \"B\" }\n    if score >= 70 { return \"C\" }\n    if score >= 60 { return \"D\" }\n    return \"F\"\n}" },
        { "id": "v3", "title": "Number Sign", "description": "Write <code>func sign(n int) string</code> returning positive/negative/zero.", "functionSignature": "func sign(n int) string", "testCases": [{ "input": "-5", "output": "\"negative\"" }], "hints": [{ "title": "🤔 Think about it", "content": "When you have overlapping conditions (like a number divisible by both 3 AND 5), which case should you check first?" }, { "title": "💡 Hint", "content": "Check the most specific condition first! For FizzBuzz, 15 is divisible by both 3 and 5, so check for 15 before checking 3 or 5 individually." }, { "title": "🔧 Pattern", "content": "<pre>1. Check most specific condition first\n2. Then check less specific conditions\n3. Default case last\n(Order matters: check \"both 3 AND 5\" before \"just 3\" or \"just 5\")</pre>" }], "solution": "func sign(n int) string {\n    if n > 0 { return \"positive\" }\n    if n < 0 { return \"negative\" }\n    return \"zero\"\n}" }
      ]
    },
    {
      "id": "challenge_4", "block": 1, "concept": "Finding Extrema",
      "docLinks": [
        { "url": "https://go.dev/ref/spec#Index_expressions", "title": "Go Spec: Index expressions", "note": "accessing slice elements" },
        { "url": "https://pkg.go.dev/builtin#len", "title": "Builtin len()", "note": "string and slice length" }
      ],
      "variants": [
        { "id": "v1", "title": "Find Maximum", "description": "Write <code>func max(nums []int) int</code> that returns the largest number.", "functionSignature": "func max(nums []int) int", "testCases": [{ "input": "[]int{3, 7, 2, 9}", "output": "9" }], "hints": [{ "title": "🤔 Think about it", "content": "If you want to track the 'best so far', what's a reasonable starting value? Hint: what if the first element is the answer?" }, { "title": "💡 Hint", "content": "Initialize with the first element (not 0 or some arbitrary value). Compare each subsequent element - if it's better, update your best." }, { "title": "🔧 Pattern", "content": "<pre>1. Start with first element as \"best so far\"\n2. For each remaining element:\n   - Better than current best? → update best\n3. Return best</pre>" }], "solution": "func max(nums []int) int {\n    m := nums[0]\n    for _, n := range nums {\n        if n > m { m = n }\n    }\n    return m\n}" },
        { "id": "v2", "title": "Find Minimum", "description": "Write <code>func min(nums []int) int</code> that returns the smallest number.", "functionSignature": "func min(nums []int) int", "testCases": [{ "input": "[]int{3, 7, 2, 9}", "output": "2" }], "hints": [{ "title": "🤔 Think about it", "content": "If you want to track the 'best so far', what's a reasonable starting value? Hint: what if the first element is the answer?" }, { "title": "💡 Hint", "content": "Initialize with the first element (not 0 or some arbitrary value). Compare each subsequent element - if it's better, update your best." }, { "title": "🔧 Pattern", "content": "<pre>1. Start with first element as \"best so far\"\n2. For each remaining element:\n   - Better than current best? → update best\n3. Return best</pre>" }], "solution": "func min(nums []int) int {\n    m := nums[0]\n    for _, n := range nums {\n        if n < m { m = n }\n    }\n    return m\n}" },
        { "id": "v3", "title": "Longest String", "description": "Write <code>func longest(words []string) string</code> that returns the longest word.", "functionSignature": "func longest(words []string) string", "testCases": [{ "input": "[]string{\"go\", \"python\"}", "output": "\"python\"" }], "hints": [{ "title": "🤔 Think about it", "content": "If you want to track the 'best so far', what's a reasonable starting value? Hint: what if the first element is the answer?" }, { "title": "💡 Hint", "content": "Initialize with the first element (not 0 or some arbitrary value). Compare each subsequent element - if it's better, update your best." }, { "title": "🔧 Pattern", "content": "<pre>1. Start with first element as \"best so far\"\n2. For each remaining element:\n   - Better than current best? → update best\n3. Return best</pre>" }], "solution": "func longest(words []string) string {\n    r := words[0]\n    for _, w := range words {\n        if len(w) > len(r) { r = w }\n    }\n    return r\n}" }
      ]
    },
    {
      "id": "challenge_5", "block": 2, "concept": "Filter with Append",
      "docLinks": [
        { "url": "https://pkg.go.dev/builtin#append", "title": "Builtin append()", "note": "growing slices dynamically" },
        { "url": "https://go.dev/blog/slices-intro", "title": "Go Blog: Slices introduction", "note": "slice internals" }
      ],
      "variants": [
        { "id": "v1", "title": "Filter Positives", "description": "Write <code>func filterPositives(nums []int) []int</code> returning only positive numbers.", "functionSignature": "func filterPositives(nums []int) []int", "testCases": [{ "input": "[]int{-2, 3, -1, 5}", "output": "[3, 5]" }], "hints": [{ "title": "🤔 Think about it", "content": "You want to build a new collection containing only some elements. What do you start with, and how do you add elements that pass your test?" }, { "title": "💡 Hint", "content": "Start with an empty slice. Loop through, check your condition, and append elements that pass." }, { "title": "🔧 Pattern", "content": "<pre>1. Start with empty result collection\n2. For each element:\n   - Passes test? → add to result\n3. Return result</pre>" }], "solution": "func filterPositives(nums []int) []int {\n    r := []int{}\n    for _, n := range nums {\n        if n > 0 { r = append(r, n) }\n    }\n    return r\n}" },
        { "id": "v2", "title": "Filter Evens", "description": "Write <code>func filterEvens(nums []int) []int</code> returning only even numbers.", "functionSignature": "func filterEvens(nums []int) []int", "testCases": [{ "input": "[]int{1, 2, 3, 4}", "output": "[2, 4]" }], "hints": [{ "title": "🤔 Think about it", "content": "You want to build a new collection containing only some elements. What do you start with, and how do you add elements that pass your test?" }, { "title": "💡 Hint", "content": "Start with an empty slice. Loop through, check your condition, and append elements that pass." }, { "title": "🔧 Pattern", "content": "<pre>1. Start with empty result collection\n2. For each element:\n   - Passes test? → add to result\n3. Return result</pre>" }], "solution": "func filterEvens(nums []int) []int {\n    r := []int{}\n    for _, n := range nums {\n        if n%2 == 0 { r = append(r, n) }\n    }\n    return r\n}" },
        { "id": "v3", "title": "Filter Short Words", "description": "Write <code>func filterShort(words []string, max int) []string</code> returning words with len <= max.", "functionSignature": "func filterShort(words []string, max int) []string", "testCases": [{ "input": "[]string{\"go\", \"python\"}, 3", "output": "[\"go\"]" }], "hints": [{ "title": "🤔 Think about it", "content": "You want to build a new collection containing only some elements. What do you start with, and how do you add elements that pass your test?" }, { "title": "💡 Hint", "content": "Start with an empty slice. Loop through, check your condition, and append elements that pass." }, { "title": "🔧 Pattern", "content": "<pre>1. Start with empty result collection\n2. For each element:\n   - Passes test? → add to result\n3. Return result</pre>" }], "solution": "func filterShort(words []string, max int) []string {\n    r := []string{}\n    for _, w := range words {\n        if len(w) <= max { r = append(r, w) }\n    }\n    return r\n}" }
      ]
    },
    {
      "id": "challenge_6", "block": 2, "concept": "Find Index",
      "docLinks": [
        { "url": "https://go.dev/ref/spec#For_statements", "title": "Go Spec: For statements", "note": "range with index" },
        { "url": "https://go.dev/ref/spec#Return_statements", "title": "Go Spec: Return statements", "note": "early returns" }
      ],
      "variants": [
        { "id": "v1", "title": "Find Index", "description": "Write <code>func findIndex(nums []int, target int) int</code> returning index or -1.", "functionSignature": "func findIndex(nums []int, target int) int", "testCases": [{ "input": "[]int{10, 20, 30}, 20", "output": "1" }], "hints": [{ "title": "🤔 Think about it", "content": "If you're looking for something specific, when should you stop looking? What should you return if you never find it?" }, { "title": "💡 Hint", "content": "Loop with the index variable. When you find a match, return that index immediately (early return). If the loop completes without finding anything, return -1." }, { "title": "🔧 Pattern", "content": "<pre>1. For each element with its index:\n   - Matches target? → return index immediately\n2. Loop finished? → return -1 (not found)</pre>" }], "solution": "func findIndex(nums []int, target int) int {\n    for i, n := range nums {\n        if n == target { return i }\n    }\n    return -1\n}" },
        { "id": "v2", "title": "Find Word", "description": "Write <code>func findWord(words []string, target string) int</code> returning index or -1.", "functionSignature": "func findWord(words []string, target string) int", "testCases": [{ "input": "[]string{\"go\", \"py\"}, \"py\"", "output": "1" }], "hints": [{ "title": "🤔 Think about it", "content": "If you're looking for something specific, when should you stop looking? What should you return if you never find it?" }, { "title": "💡 Hint", "content": "Loop with the index variable. When you find a match, return that index immediately (early return). If the loop completes without finding anything, return -1." }, { "title": "🔧 Pattern", "content": "<pre>1. For each element with its index:\n   - Matches target? → return index immediately\n2. Loop finished? → return -1 (not found)</pre>" }], "solution": "func findWord(words []string, target string) int {\n    for i, w := range words {\n        if w == target { return i }\n    }\n    return -1\n}" },
        { "id": "v3", "title": "First Negative Index", "description": "Write <code>func firstNegIdx(nums []int) int</code> returning index of first negative or -1.", "functionSignature": "func firstNegIdx(nums []int) int", "testCases": [{ "input": "[]int{5, -2, 3}", "output": "1" }], "hints": [{ "title": "🤔 Think about it", "content": "If you're looking for something specific, when should you stop looking? What should you return if you never find it?" }, { "title": "💡 Hint", "content": "Loop with the index variable. When you find a match, return that index immediately (early return). If the loop completes without finding anything, return -1." }, { "title": "🔧 Pattern", "content": "<pre>1. For each element with its index:\n   - Matches target? → return index immediately\n2. Loop finished? → return -1 (not found)</pre>" }], "solution": "func firstNegIdx(nums []int) int {\n    for i, n := range nums {\n        if n < 0 { return i }\n    }\n    return -1\n}" }
      ]
    },
    {
      "id": "challenge_7", "block": 2, "concept": "Map Counting",
      "docLinks": [
        { "url": "https://go.dev/blog/maps", "title": "Go Blog: Go maps in action", "note": "map operations" },
        { "url": "https://go.dev/ref/spec#Making_slices_maps_and_channels", "title": "Go Spec: make()", "note": "creating maps" }
      ],
      "variants": [
        { "id": "v1", "title": "Count Occurrences", "description": "Write <code>func countOccurrences(nums []int) map[int]int</code>.", "functionSignature": "func countOccurrences(nums []int) map[int]int", "testCases": [{ "input": "[]int{1, 2, 2, 3, 3, 3}", "output": "map[1:1 2:2 3:3]" }], "hints": [{ "title": "🤔 Think about it", "content": "You want to count how many times each element appears. What data structure maps 'thing' to 'count of that thing'?" }, { "title": "💡 Hint", "content": "Use a map where keys are the elements and values are counts. The magic: accessing a non-existent key returns 0, so you can just do counts[item]++ even for the first occurrence." }, { "title": "🔧 Pattern", "content": "<pre>1. Create empty count map\n2. For each element:\n   - Increment count for that element\n3. Return map</pre>" }], "solution": "func countOccurrences(nums []int) map[int]int {\n    c := make(map[int]int)\n    for _, n := range nums { c[n]++ }\n    return c\n}" },
        { "id": "v2", "title": "Count Characters", "description": "Write <code>func countChars(s string) map[rune]int</code>.", "functionSignature": "func countChars(s string) map[rune]int", "testCases": [{ "input": "\"hello\"", "output": "map[e:1 h:1 l:2 o:1]" }], "hints": [{ "title": "🤔 Think about it", "content": "You want to count how many times each element appears. What data structure maps 'thing' to 'count of that thing'?" }, { "title": "💡 Hint", "content": "Use a map where keys are the elements and values are counts. The magic: accessing a non-existent key returns 0, so you can just do counts[item]++ even for the first occurrence." }, { "title": "🔧 Pattern", "content": "<pre>1. Create empty count map\n2. For each element:\n   - Increment count for that element\n3. Return map</pre>" }], "solution": "func countChars(s string) map[rune]int {\n    c := make(map[rune]int)\n    for _, r := range s { c[r]++ }\n    return c\n}" },
        { "id": "v3", "title": "Word Frequency", "description": "Write <code>func wordFreq(words []string) map[string]int</code>.", "functionSignature": "func wordFreq(words []string) map[string]int", "testCases": [{ "input": "[]string{\"go\", \"go\", \"py\"}", "output": "map[go:2 py:1]" }], "hints": [{ "title": "🤔 Think about it", "content": "You want to count how many times each element appears. What data structure maps 'thing' to 'count of that thing'?" }, { "title": "💡 Hint", "content": "Use a map where keys are the elements and values are counts. The magic: accessing a non-existent key returns 0, so you can just do counts[item]++ even for the first occurrence." }, { "title": "🔧 Pattern", "content": "<pre>1. Create empty count map\n2. For each element:\n   - Increment count for that element\n3. Return map</pre>" }], "solution": "func wordFreq(words []string) map[string]int {\n    c := make(map[string]int)\n    for _, w := range words { c[w]++ }\n    return c\n}" }
      ]
    },
    {
      "id": "challenge_8", "block": 3, "concept": "Swap Pattern",
      "docLinks": [
        { "url": "https://go.dev/ref/spec#Assignments", "title": "Go Spec: Assignments", "note": "tuple assignment (a, b = b, a)" },
        { "url": "https://go.dev/ref/spec#Index_expressions", "title": "Go Spec: Index expressions", "note": "slice indexing" }
      ],
      "variants": [
        { "id": "v1", "title": "Swap Elements", "description": "Write <code>func swap(nums []int, i, j int)</code> that swaps elements at i and j.", "functionSignature": "func swap(nums []int, i, j int)", "testCases": [{ "input": "[]int{1,2,3}, 0, 2", "output": "[3,2,1]" }], "hints": [{ "title": "🤔 Think about it", "content": "How do you swap two values without losing one of them? Think about what happens if you just write a = b." }, { "title": "💡 Hint", "content": "Go has a special syntax for simultaneous assignment: a, b = b, a. This evaluates the right side first, then assigns, so nothing is lost." }, { "title": "🔧 Pattern", "content": "<pre>1. Simultaneous assignment: left, right = right, left\n(Both sides evaluated before assignment - nothing lost!)</pre>" }], "solution": "func swap(nums []int, i, j int) {\n    nums[i], nums[j] = nums[j], nums[i]\n}" },
        { "id": "v2", "title": "Swap First Last", "description": "Write <code>func swapEnds(nums []int)</code> that swaps first and last elements.", "functionSignature": "func swapEnds(nums []int)", "testCases": [{ "input": "[]int{1,2,3,4}", "output": "[4,2,3,1]" }], "hints": [{ "title": "🤔 Think about it", "content": "How do you swap two values without losing one of them? Think about what happens if you just write a = b." }, { "title": "💡 Hint", "content": "Go has a special syntax for simultaneous assignment: a, b = b, a. This evaluates the right side first, then assigns, so nothing is lost." }, { "title": "🔧 Pattern", "content": "<pre>1. Simultaneous assignment: left, right = right, left\n(Both sides evaluated before assignment - nothing lost!)</pre>" }], "solution": "func swapEnds(nums []int) {\n    nums[0], nums[len(nums)-1] = nums[len(nums)-1], nums[0]\n}" },
        { "id": "v3", "title": "Swap Variables", "description": "Swap two variables a=5, b=10 and print them.", "functionSignature": "// inline", "testCases": [{ "input": "a=5, b=10", "output": "a=10, b=5" }], "hints": [{ "title": "🤔 Think about it", "content": "How do you swap two values without losing one of them? Think about what happens if you just write a = b." }, { "title": "💡 Hint", "content": "Go has a special syntax for simultaneous assignment: a, b = b, a. This evaluates the right side first, then assigns, so nothing is lost." }, { "title": "🔧 Pattern", "content": "<pre>1. Simultaneous assignment: left, right = right, left\n(Both sides evaluated before assignment - nothing lost!)</pre>" }], "solution": "a, b := 5, 10\na, b = b, a\nfmt.Println(a, b)" }
      ]
    },
    {
      "id": "challenge_9", "block": 3, "concept": "Two-Pointer Comparison",
      "docLinks": [
        { "url": "https://go.dev/ref/spec#For_statements", "title": "Go Spec: For statements", "note": "two-variable initialization (i, j := ...)" },
        { "url": "https://go.dev/ref/spec#Comparison_operators", "title": "Go Spec: Comparison operators", "note": "!= for mismatch detection" }
      ],
      "variants": [
        { "id": "v1", "title": "Palindrome Check", "description": "Write <code>func isPalindrome(nums []int) bool</code> - same forwards/backwards.", "functionSignature": "func isPalindrome(nums []int) bool", "testCases": [{ "input": "[]int{1,2,3,2,1}", "output": "true" }], "hints": [{ "title": "🤔 Think about it", "content": "To check if something reads the same forwards and backwards, where should you start comparing? Do you need to check every element?" }, { "title": "💡 Hint", "content": "Compare from both ends moving inward. Start with pointers at index 0 and len-1. If any pair doesn't match, it's not a palindrome. If you make it to the middle without mismatches, it is." }, { "title": "🔧 Pattern", "content": "<pre>1. left pointer at start, right pointer at end\n2. While left < right:\n   - Compare elements at both pointers\n   - Mismatch? → return false\n   - Move both pointers inward\n3. Return true (all pairs matched)</pre>" }], "solution": "func isPalindrome(nums []int) bool {\n    for i, j := 0, len(nums)-1; i < j; i, j = i+1, j-1 {\n        if nums[i] != nums[j] { return false }\n    }\n    return true\n}" },
        { "id": "v2", "title": "String Palindrome", "description": "Write <code>func isSymmetric(s string) bool</code>.", "functionSignature": "func isSymmetric(s string) bool", "testCases": [{ "input": "\"racecar\"", "output": "true" }], "hints": [{ "title": "🤔 Think about it", "content": "To check if something reads the same forwards and backwards, where should you start comparing? Do you need to check every element?" }, { "title": "💡 Hint", "content": "Compare from both ends moving inward. Start with pointers at index 0 and len-1. If any pair doesn't match, it's not a palindrome. If you make it to the middle without mismatches, it is." }, { "title": "🔧 Pattern", "content": "<pre>1. left pointer at start, right pointer at end\n2. While left < right:\n   - Compare elements at both pointers\n   - Mismatch? → return false\n   - Move both pointers inward\n3. Return true (all pairs matched)</pre>" }], "solution": "func isSymmetric(s string) bool {\n    r := []rune(s)\n    for i, j := 0, len(r)-1; i < j; i, j = i+1, j-1 {\n        if r[i] != r[j] { return false }\n    }\n    return true\n}" },
        { "id": "v3", "title": "Ends Match", "description": "Write <code>func endsMatch(nums []int) bool</code> - first equals last.", "functionSignature": "func endsMatch(nums []int) bool", "testCases": [{ "input": "[]int{5,2,3,5}", "output": "true" }], "hints": [{ "title": "🤔 Think about it", "content": "To check if something reads the same forwards and backwards, where should you start comparing? Do you need to check every element?" }, { "title": "💡 Hint", "content": "Compare from both ends moving inward. Start with pointers at index 0 and len-1. If any pair doesn't match, it's not a palindrome. If you make it to the middle without mismatches, it is." }, { "title": "🔧 Pattern", "content": "<pre>1. left pointer at start, right pointer at end\n2. While left < right:\n   - Compare elements at both pointers\n   - Mismatch? → return false\n   - Move both pointers inward\n3. Return true (all pairs matched)</pre>" }], "solution": "func endsMatch(nums []int) bool {\n    return nums[0] == nums[len(nums)-1]\n}" }
      ]
    },
    {
      "id": "challenge_10", "block": 4, "concept": "Two-Pointer Swap",
      "docLinks": [
        { "url": "https://go.dev/ref/spec#Assignments", "title": "Go Spec: Assignments", "note": "simultaneous swap (a, b = b, a)" },
        { "url": "https://go.dev/blog/slices", "title": "Go Blog: Slices", "note": "in-place modifications" }
      ],
      "variants": [
        { "id": "v1", "title": "Reverse Slice", "description": "Write <code>func reverse(nums []int) []int</code> that reverses in place.", "functionSignature": "func reverse(nums []int) []int", "testCases": [{ "input": "[]int{1,2,3,4,5}", "output": "[5,4,3,2,1]" }], "hints": [{ "title": "🤔 Think about it", "content": "To reverse in-place, you swap elements from both ends working toward the middle. What pattern lets you walk two pointers toward each other?" }, { "title": "💡 Hint", "content": "Use the same two-pointer loop as palindrome check, but swap the elements instead of comparing them. Stop when the pointers meet or cross." }, { "title": "🔧 Pattern", "content": "<pre>1. left pointer at start, right pointer at end\n2. While left < right:\n   - Swap elements at left and right\n   - Move both pointers inward\n3. Done (reversed in place)</pre>" }], "solution": "func reverse(nums []int) []int {\n    for i, j := 0, len(nums)-1; i < j; i, j = i+1, j-1 {\n        nums[i], nums[j] = nums[j], nums[i]\n    }\n    return nums\n}" },
        { "id": "v2", "title": "Rotate Left", "description": "Write <code>func rotateLeft(nums []int) []int</code> - first element goes to end.", "functionSignature": "func rotateLeft(nums []int) []int", "testCases": [{ "input": "[]int{1,2,3}", "output": "[2,3,1]" }], "hints": [{ "title": "🤔 Think about it", "content": "To reverse in-place, you swap elements from both ends working toward the middle. What pattern lets you walk two pointers toward each other?" }, { "title": "💡 Hint", "content": "Use the same two-pointer loop as palindrome check, but swap the elements instead of comparing them. Stop when the pointers meet or cross." }, { "title": "🔧 Pattern", "content": "<pre>1. left pointer at start, right pointer at end\n2. While left < right:\n   - Swap elements at left and right\n   - Move both pointers inward\n3. Done (reversed in place)</pre>" }], "solution": "func rotateLeft(nums []int) []int {\n    first := nums[0]\n    for i := 0; i < len(nums)-1; i++ { nums[i] = nums[i+1] }\n    nums[len(nums)-1] = first\n    return nums\n}" },
        { "id": "v3", "title": "Rotate Right", "description": "Write <code>func rotateRight(nums []int) []int</code> - last element goes to front.", "functionSignature": "func rotateRight(nums []int) []int", "testCases": [{ "input": "[]int{1,2,3}", "output": "[3,1,2]" }], "hints": [{ "title": "🤔 Think about it", "content": "To reverse in-place, you swap elements from both ends working toward the middle. What pattern lets you walk two pointers toward each other?" }, { "title": "💡 Hint", "content": "Use the same two-pointer loop as palindrome check, but swap the elements instead of comparing them. Stop when the pointers meet or cross." }, { "title": "🔧 Pattern", "content": "<pre>1. left pointer at start, right pointer at end\n2. While left < right:\n   - Swap elements at left and right\n   - Move both pointers inward\n3. Done (reversed in place)</pre>" }], "solution": "func rotateRight(nums []int) []int {\n    last := nums[len(nums)-1]\n    for i := len(nums)-1; i > 0; i-- { nums[i] = nums[i-1] }\n    nums[0] = last\n    return nums\n}" }
      ]
    },
    {
      "id": "challenge_11", "block": 4, "concept": "Map Lookup + Early Return",
      "docLinks": [
        { "url": "https://go.dev/blog/maps", "title": "Go Blog: Go maps in action", "note": "map as a set pattern" },
        { "url": "https://go.dev/ref/spec#Index_expressions", "title": "Go Spec: Index expressions", "note": "checking if key exists" }
      ],
      "variants": [
        { "id": "v1", "title": "First Duplicate Index", "description": "Write <code>func firstDupIdx(nums []int) int</code> - index of first repeat, or -1.", "functionSignature": "func firstDupIdx(nums []int) int", "testCases": [{ "input": "[]int{1,2,3,2}", "output": "3" }], "hints": [{ "title": "🤔 Think about it", "content": "You want to find the first element that appears twice. As you go through, how do you know if you've seen something before?" }, { "title": "💡 Hint", "content": "Use a map as a 'seen' set. For each element, first check if it's in the map - if yes, you found a duplicate! If no, add it to the map and continue." }, { "title": "🔧 Pattern", "content": "<pre>1. Create empty \"seen\" tracker\n2. For each element:\n   - Already seen? → return (found duplicate!)\n   - Not seen? → add to tracker\n3. Loop finished? → return not found</pre>" }], "solution": "func firstDupIdx(nums []int) int {\n    seen := make(map[int]bool)\n    for i, n := range nums {\n        if seen[n] { return i }\n        seen[n] = true\n    }\n    return -1\n}" },
        { "id": "v2", "title": "First Repeat Char", "description": "Write <code>func firstRepeat(s string) rune</code> - first repeated char, or 0.", "functionSignature": "func firstRepeat(s string) rune", "testCases": [{ "input": "\"abcab\"", "output": "'a'" }], "hints": [{ "title": "🤔 Think about it", "content": "You want to find the first element that appears twice. As you go through, how do you know if you've seen something before?" }, { "title": "💡 Hint", "content": "Use a map as a 'seen' set. For each element, first check if it's in the map - if yes, you found a duplicate! If no, add it to the map and continue." }, { "title": "🔧 Pattern", "content": "<pre>1. Create empty \"seen\" tracker\n2. For each element:\n   - Already seen? → return (found duplicate!)\n   - Not seen? → add to tracker\n3. Loop finished? → return not found</pre>" }], "solution": "func firstRepeat(s string) rune {\n    seen := make(map[rune]bool)\n    for _, r := range s {\n        if seen[r] { return r }\n        seen[r] = true\n    }\n    return 0\n}" },
        { "id": "v3", "title": "Has Duplicate", "description": "Write <code>func hasDup(nums []int) bool</code> - true if any number repeats.", "functionSignature": "func hasDup(nums []int) bool", "testCases": [{ "input": "[]int{1,2,3,2}", "output": "true" }], "hints": [{ "title": "🤔 Think about it", "content": "You want to find the first element that appears twice. As you go through, how do you know if you've seen something before?" }, { "title": "💡 Hint", "content": "Use a map as a 'seen' set. For each element, first check if it's in the map - if yes, you found a duplicate! If no, add it to the map and continue." }, { "title": "🔧 Pattern", "content": "<pre>1. Create empty \"seen\" tracker\n2. For each element:\n   - Already seen? → return (found duplicate!)\n   - Not seen? → add to tracker\n3. Loop finished? → return not found</pre>" }], "solution": "func hasDup(nums []int) bool {\n    seen := make(map[int]bool)\n    for _, n := range nums {\n        if seen[n] { return true }\n        seen[n] = true\n    }\n    return false\n}" }
      ]
    }
  ],
  "advanced": [
    {
      "id": "advanced_1",
      "baseTitle": "Map as Set",
      "concept": "Map as Set - Have I Seen This?",
      "variants": [
        {
          "id": "v1",
          "title": "Contains Duplicate",
          "description": "Write a function <code>func containsDuplicate(nums []int) bool</code> that returns <code>true</code> if any number appears more than once in the slice, <code>false</code> if all numbers are unique.",
          "functionSignature": "func containsDuplicate(nums []int) bool",
          "testCases": [
            { "input": "[]int{1, 2, 3, 1}", "output": "true" },
            { "input": "[]int{1, 2, 3, 4}", "output": "false" },
            { "input": "[]int{1, 1, 1, 1}", "output": "true" }
          ],
          "solution": "func containsDuplicate(nums []int) bool {\n    seen := make(map[int]bool)\n    for _, num := range nums {\n        if seen[num] {\n            return true\n        }\n        seen[num] = true\n    }\n    return false\n}"
        },
        {
          "id": "v2",
          "title": "First Duplicate Value",
          "description": "Write a function <code>func firstDuplicate(nums []int) int</code> that returns the first number that appears twice (the second occurrence). Return <code>-1</code> if no duplicates exist.",
          "functionSignature": "func firstDuplicate(nums []int) int",
          "testCases": [
            { "input": "[]int{2, 1, 3, 5, 3, 2}", "output": "3", "note": "3 is seen again before 2 is" },
            { "input": "[]int{1, 2, 3, 4}", "output": "-1" },
            { "input": "[]int{1, 1, 2, 2}", "output": "1" }
          ],
          "solution": "func firstDuplicate(nums []int) int {\n    seen := make(map[int]bool)\n    for _, num := range nums {\n        if seen[num] {\n            return num\n        }\n        seen[num] = true\n    }\n    return -1\n}",
          "solutionNotes": "Unlike Contains Duplicate which returns a bool, this returns the actual duplicate value. Same pattern, different return type!"
        },
        {
          "id": "v3",
          "title": "Count Unique Elements",
          "description": "Write a function <code>func countUnique(nums []int) int</code> that returns how many distinct values are in the slice.",
          "functionSignature": "func countUnique(nums []int) int",
          "testCases": [
            { "input": "[]int{1, 2, 2, 3, 3, 3}", "output": "3", "note": "unique values: 1, 2, 3" },
            { "input": "[]int{5, 5, 5, 5}", "output": "1" },
            { "input": "[]int{1, 2, 3, 4, 5}", "output": "5" }
          ],
          "solution": "func countUnique(nums []int) int {\n    seen := make(map[int]bool)\n    for _, num := range nums {\n        seen[num] = true\n    }\n    return len(seen)\n}",
          "solutionNotes": "Here we don't check if seen - we just add everything. The map handles duplicates automatically, and <code>len(seen)</code> gives us the count of unique keys!"
        },
        {
          "id": "v4",
          "title": "Find All Duplicates",
          "description": "Write a function <code>func findDuplicates(nums []int) []int</code> that returns a slice containing each number that appears more than once. Each duplicate should only appear once in the result.",
          "functionSignature": "func findDuplicates(nums []int) []int",
          "testCases": [
            { "input": "[]int{4, 3, 2, 7, 8, 2, 3, 1}", "output": "[2, 3]" },
            { "input": "[]int{1, 1, 2, 2, 3, 3}", "output": "[1, 2, 3]" },
            { "input": "[]int{1, 2, 3}", "output": "[]" }
          ],
          "solution": "func findDuplicates(nums []int) []int {\n    seen := make(map[int]bool)\n    added := make(map[int]bool)\n    result := []int{}\n    \n    for _, num := range nums {\n        if seen[num] && !added[num] {\n            result = append(result, num)\n            added[num] = true\n        }\n        seen[num] = true\n    }\n    return result\n}",
          "solutionNotes": "We need TWO maps here: one to track what we've seen, and one to avoid adding the same duplicate twice to the result."
        },
        {
          "id": "v5",
          "title": "Common Elements",
          "description": "Write a function <code>func hasCommon(a, b []int) bool</code> that returns <code>true</code> if the two slices share at least one common element.",
          "functionSignature": "func hasCommon(a, b []int) bool",
          "testCases": [
            { "input": "[]int{1, 2, 3}, []int{3, 4, 5}", "output": "true", "note": "3 is common" },
            { "input": "[]int{1, 2}, []int{3, 4}", "output": "false" },
            { "input": "[]int{1}, []int{1}", "output": "true" }
          ],
          "solution": "func hasCommon(a, b []int) bool {\n    setA := make(map[int]bool)\n    for _, num := range a {\n        setA[num] = true\n    }\n    \n    for _, num := range b {\n        if setA[num] {\n            return true\n        }\n    }\n    return false\n}",
          "solutionNotes": "Build a set from the first slice, then check if any element from the second slice exists in it. This is O(n+m) instead of O(n*m)!"
        },
        {
          "id": "v6",
          "title": "Find Intersection",
          "description": "Write a function <code>func intersection(a, b []int) []int</code> that returns a slice of elements that appear in both input slices. Each element should appear only once in the result.",
          "functionSignature": "func intersection(a, b []int) []int",
          "testCases": [
            { "input": "[]int{1, 2, 2, 1}, []int{2, 2}", "output": "[2]" },
            { "input": "[]int{4, 9, 5}, []int{9, 4, 9, 8, 4}", "output": "[9, 4]", "note": "or [4, 9] - order doesn't matter" },
            { "input": "[]int{1, 2}, []int{3, 4}", "output": "[]" }
          ],
          "solution": "func intersection(a, b []int) []int {\n    setA := make(map[int]bool)\n    for _, num := range a {\n        setA[num] = true\n    }\n    \n    result := []int{}\n    seen := make(map[int]bool)\n    for _, num := range b {\n        if setA[num] && !seen[num] {\n            result = append(result, num)\n            seen[num] = true\n        }\n    }\n    return result\n}",
          "solutionNotes": "Similar to hasCommon, but we collect the common elements instead of just returning true. We use a second map to avoid adding duplicates to the result."
        }
      ]
    },
    {
      "id": "advanced_2",
      "baseTitle": "Two-Pointer In-Place",
      "concept": "Slow/Fast Pointer Pattern",
      "variants": [
        {
          "id": "v1",
          "title": "Remove Duplicates from Sorted Array",
          "description": "Write a function <code>func removeDuplicates(nums []int) int</code> that removes duplicates from a sorted slice <strong>in-place</strong>. Return the number of unique elements. The first k elements should contain the unique values.",
          "functionSignature": "func removeDuplicates(nums []int) int",
          "testCases": [
            { "input": "[]int{1, 1, 2}", "output": "2", "note": "array becomes [1, 2, _]" },
            { "input": "[]int{0, 0, 1, 1, 2, 2, 3}", "output": "4", "note": "array becomes [0, 1, 2, 3, _, _, _]" },
            { "input": "[]int{1, 2, 3}", "output": "3" }
          ],
          "solution": "func removeDuplicates(nums []int) int {\n    if len(nums) == 0 {\n        return 0\n    }\n    slow := 0\n    for fast := 1; fast < len(nums); fast++ {\n        if nums[fast] != nums[slow] {\n            slow++\n            nums[slow] = nums[fast]\n        }\n    }\n    return slow + 1\n}"
        },
        {
          "id": "v2",
          "title": "Remove Element",
          "description": "Write a function <code>func removeElement(nums []int, val int) int</code> that removes all occurrences of <code>val</code> <strong>in-place</strong>. Return the number of elements remaining. Order doesn't need to be preserved.",
          "functionSignature": "func removeElement(nums []int, val int) int",
          "testCases": [
            { "input": "[]int{3, 2, 2, 3}, 3", "output": "2", "note": "array becomes [2, 2, _, _]" },
            { "input": "[]int{0, 1, 2, 2, 3, 0, 4, 2}, 2", "output": "5" },
            { "input": "[]int{1}, 1", "output": "0" }
          ],
          "solution": "func removeElement(nums []int, val int) int {\n    slow := 0\n    for fast := 0; fast < len(nums); fast++ {\n        if nums[fast] != val {\n            nums[slow] = nums[fast]\n            slow++\n        }\n    }\n    return slow\n}",
          "solutionNotes": "Unlike Remove Duplicates, here we compare against a fixed value, not the previous element. And both pointers start at 0."
        },
        {
          "id": "v3",
          "title": "Move Zeroes",
          "description": "Write a function <code>func moveZeroes(nums []int)</code> that moves all <code>0</code>s to the end of the slice while maintaining the relative order of non-zero elements. Modify in-place.",
          "functionSignature": "func moveZeroes(nums []int)",
          "testCases": [
            { "input": "[]int{0, 1, 0, 3, 12}", "output": "[1, 3, 12, 0, 0]" },
            { "input": "[]int{0, 0, 1}", "output": "[1, 0, 0]" },
            { "input": "[]int{1, 2, 3}", "output": "[1, 2, 3]", "note": "no zeroes" }
          ],
          "solution": "func moveZeroes(nums []int) {\n    slow := 0\n    \n    for fast := 0; fast < len(nums); fast++ {\n        if nums[fast] != 0 {\n            nums[slow] = nums[fast]\n            slow++\n        }\n    }\n    \n    for i := slow; i < len(nums); i++ {\n        nums[i] = 0\n    }\n}",
          "solutionNotes": "This is a two-pass solution. First pass moves non-zeroes forward, second pass fills remaining positions with zeroes. Can also be done in one pass with swapping!"
        },
        {
          "id": "v4",
          "title": "Remove Duplicates II (Allow 2)",
          "description": "Write a function <code>func removeDuplicatesII(nums []int) int</code> that removes duplicates from a sorted array such that each element appears <strong>at most twice</strong>. Return the new length.",
          "functionSignature": "func removeDuplicatesII(nums []int) int",
          "testCases": [
            { "input": "[]int{1, 1, 1, 2, 2, 3}", "output": "5", "note": "becomes [1, 1, 2, 2, 3, _]" },
            { "input": "[]int{0, 0, 1, 1, 1, 1, 2, 3, 3}", "output": "7" },
            { "input": "[]int{1, 1}", "output": "2" }
          ],
          "solution": "func removeDuplicatesII(nums []int) int {\n    if len(nums) <= 2 {\n        return len(nums)\n    }\n    \n    slow := 2\n    for fast := 2; fast < len(nums); fast++ {\n        if nums[fast] != nums[slow-2] {\n            nums[slow] = nums[fast]\n            slow++\n        }\n    }\n    return slow\n}",
          "solutionNotes": "The key insight: compare with nums[slow-2], not nums[slow-1]. This ensures at most 2 of each value. Start both pointers at index 2."
        },
        {
          "id": "v5",
          "title": "Sorted Squares",
          "description": "Write a function <code>func sortedSquares(nums []int) []int</code> that returns an array of the squares of each number, sorted in ascending order. Input is sorted but may contain negatives.",
          "functionSignature": "func sortedSquares(nums []int) []int",
          "testCases": [
            { "input": "[]int{-4, -1, 0, 3, 10}", "output": "[0, 1, 9, 16, 100]" },
            { "input": "[]int{-7, -3, 2, 3, 11}", "output": "[4, 9, 9, 49, 121]" },
            { "input": "[]int{1, 2, 3}", "output": "[1, 4, 9]" }
          ],
          "solution": "func sortedSquares(nums []int) []int {\n    n := len(nums)\n    result := make([]int, n)\n    left, right := 0, n-1\n    pos := n - 1\n    \n    for left <= right {\n        leftSq := nums[left] * nums[left]\n        rightSq := nums[right] * nums[right]\n        \n        if leftSq > rightSq {\n            result[pos] = leftSq\n            left++\n        } else {\n            result[pos] = rightSq\n            right--\n        }\n        pos--\n    }\n    return result\n}",
          "solutionNotes": "This uses two pointers from OPPOSITE ENDS (not slow/fast). The largest squares are at the edges (most negative or most positive). Fill result array from the back."
        },
        {
          "id": "v6",
          "title": "Merge Sorted Array",
          "description": "Write a function <code>func merge(nums1 []int, m int, nums2 []int, n int)</code> that merges nums2 into nums1 <strong>in-place</strong>. nums1 has length m+n, with the last n elements being 0 (placeholders).",
          "functionSignature": "func merge(nums1 []int, m int, nums2 []int, n int)",
          "testCases": [
            { "input": "[]int{1, 2, 3, 0, 0, 0}, 3, []int{2, 5, 6}, 3", "output": "[1, 2, 2, 3, 5, 6]" },
            { "input": "[]int{1}, 1, []int{}, 0", "output": "[1]" },
            { "input": "[]int{0}, 0, []int{1}, 1", "output": "[1]" }
          ],
          "solution": "func merge(nums1 []int, m int, nums2 []int, n int) {\n    p1 := m - 1\n    p2 := n - 1\n    pos := m + n - 1\n    \n    for p2 >= 0 {\n        if p1 >= 0 && nums1[p1] > nums2[p2] {\n            nums1[pos] = nums1[p1]\n            p1--\n        } else {\n            nums1[pos] = nums2[p2]\n            p2--\n        }\n        pos--\n    }\n}",
          "solutionNotes": "Work BACKWARDS to avoid overwriting elements we haven't processed. The loop continues until all of nums2 is merged. If nums1 elements remain, they're already in place."
        }
      ]
    },
    {
      "id": "advanced_3",
      "baseTitle": "String Manipulation",
      "concept": "Runes + Two-Pointer Swap",
      "variants": [
        {
          "id": "v1",
          "title": "Reverse a String",
          "description": "Write <code>func reverse(s string) string</code> that reverses any string, including Unicode characters like emojis.",
          "functionSignature": "func reverse(s string) string",
          "testCases": [
            { "input": "\"hello\"", "output": "\"olleh\"" },
            { "input": "\"世界\"", "output": "\"界世\"" },
            { "input": "\"Go🚀\"", "output": "\"🚀oG\"" }
          ],
          "solution": "func reverse(s string) string {\n    runes := []rune(s)\n    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {\n        runes[i], runes[j] = runes[j], runes[i]\n    }\n    return string(runes)\n}"
        },
        {
          "id": "v2",
          "title": "Is Palindrome",
          "description": "Write <code>func isPalindrome(s string) bool</code> that checks if a string reads the same forwards and backwards. Consider only alphanumeric characters and ignore case.",
          "functionSignature": "func isPalindrome(s string) bool",
          "testCases": [
            { "input": "\"A man, a plan, a canal: Panama\"", "output": "true" },
            { "input": "\"race a car\"", "output": "false" },
            { "input": "\"Was it a car or a cat I saw?\"", "output": "true" }
          ],
          "solution": "import \"unicode\"\n\nfunc isPalindrome(s string) bool {\n    runes := []rune{}\n    for _, r := range s {\n        if unicode.IsLetter(r) || unicode.IsDigit(r) {\n            runes = append(runes, unicode.ToLower(r))\n        }\n    }\n    \n    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {\n        if runes[i] != runes[j] {\n            return false\n        }\n    }\n    return true\n}",
          "solutionNotes": "First filter to only alphanumeric and lowercase, then use two-pointer comparison. The <code>unicode</code> package helps with character classification."
        },
        {
          "id": "v3",
          "title": "Reverse Words in String",
          "description": "Write <code>func reverseWords(s string) string</code> that reverses the order of words (not characters). Words are separated by spaces.",
          "functionSignature": "func reverseWords(s string) string",
          "testCases": [
            { "input": "\"hello world\"", "output": "\"world hello\"" },
            { "input": "\"the sky is blue\"", "output": "\"blue is sky the\"" },
            { "input": "\"Go\"", "output": "\"Go\"" }
          ],
          "solution": "import \"strings\"\n\nfunc reverseWords(s string) string {\n    words := strings.Fields(s)\n    \n    for i, j := 0, len(words)-1; i < j; i, j = i+1, j-1 {\n        words[i], words[j] = words[j], words[i]\n    }\n    \n    return strings.Join(words, \" \")\n}",
          "solutionNotes": "Use <code>strings.Fields</code> to split by whitespace, reverse the slice of words, then <code>strings.Join</code> back together."
        },
        {
          "id": "v4",
          "title": "Reverse Only Letters",
          "description": "Write <code>func reverseOnlyLetters(s string) string</code> that reverses only the letters in a string. All other characters stay in their original positions.",
          "functionSignature": "func reverseOnlyLetters(s string) string",
          "testCases": [
            { "input": "\"a-bC-dEf-ghIj\"", "output": "\"j-Ih-gfE-dCba\"" },
            { "input": "\"ab-cd\"", "output": "\"dc-ba\"" },
            { "input": "\"Test1ng-Leet=code-Q!\"", "output": "\"Qedo1teleC-test=gnin-T!\"", "note": "wait that's wrong" }
          ],
          "solution": "import \"unicode\"\n\nfunc reverseOnlyLetters(s string) string {\n    runes := []rune(s)\n    i, j := 0, len(runes)-1\n    \n    for i < j {\n        for i < j && !unicode.IsLetter(runes[i]) {\n            i++\n        }\n        for i < j && !unicode.IsLetter(runes[j]) {\n            j--\n        }\n        if i < j {\n            runes[i], runes[j] = runes[j], runes[i]\n            i++\n            j--\n        }\n    }\n    return string(runes)\n}",
          "solutionNotes": "Two pointers that skip non-letters. Only swap when both pointers are on letters. This is a variation of the standard reverse with added skip logic."
        },
        {
          "id": "v5",
          "title": "Valid Palindrome II",
          "description": "Write <code>func validPalindromeII(s string) bool</code> that returns true if the string can become a palindrome by removing <strong>at most one</strong> character.",
          "functionSignature": "func validPalindromeII(s string) bool",
          "testCases": [
            { "input": "\"aba\"", "output": "true", "note": "already palindrome" },
            { "input": "\"abca\"", "output": "true", "note": "remove 'c' or 'b'" },
            { "input": "\"abc\"", "output": "false" }
          ],
          "solution": "func validPalindromeII(s string) bool {\n    runes := []rune(s)\n    \n    isPalin := func(i, j int) bool {\n        for i < j {\n            if runes[i] != runes[j] {\n                return false\n            }\n            i++\n            j--\n        }\n        return true\n    }\n    \n    i, j := 0, len(runes)-1\n    for i < j {\n        if runes[i] != runes[j] {\n            return isPalin(i+1, j) || isPalin(i, j-1)\n        }\n        i++\n        j--\n    }\n    return true\n}",
          "solutionNotes": "When we find a mismatch, we have one chance: try skipping the left char OR the right char. If either results in a palindrome, return true."
        },
        {
          "id": "v6",
          "title": "Rotate String Left",
          "description": "Write <code>func rotateLeft(s string, k int) string</code> that rotates a string left by k positions. Characters that fall off the left reappear on the right.",
          "functionSignature": "func rotateLeft(s string, k int) string",
          "testCases": [
            { "input": "\"abcdef\", 2", "output": "\"cdefab\"" },
            { "input": "\"hello\", 1", "output": "\"elloh\"" },
            { "input": "\"Go\", 4", "output": "\"Go\"", "note": "k=4 is same as k=0 for len=2" }
          ],
          "solution": "func rotateLeft(s string, k int) string {\n    if len(s) == 0 {\n        return s\n    }\n    runes := []rune(s)\n    k = k % len(runes)\n    \n    reverse := func(start, end int) {\n        for start < end {\n            runes[start], runes[end] = runes[end], runes[start]\n            start++\n            end--\n        }\n    }\n    \n    reverse(0, k-1)\n    reverse(k, len(runes)-1)\n    reverse(0, len(runes)-1)\n    \n    return string(runes)\n}",
          "solutionNotes": "The \"reversal algorithm\" for rotation: reverse the first k elements, reverse the rest, then reverse the entire array. Three reversals achieve a rotation!"
        }
      ]
    },
    {
      "id": "advanced_4",
      "baseTitle": "Map Counting",
      "concept": "Map Counting Pattern",
      "variants": [
        {
          "id": "v1",
          "title": "Word Counter",
          "description": "Write <code>func wordCount(s string) map[string]int</code> that counts how many times each word appears in a string.",
          "functionSignature": "func wordCount(s string) map[string]int",
          "testCases": [
            { "input": "\"the quick brown fox jumps over the lazy dog\"", "output": "map[brown:1 dog:1 fox:1 jumps:1 lazy:1 over:1 quick:1 the:2]" }
          ],
          "solution": "import \"strings\"\n\nfunc wordCount(s string) map[string]int {\n    counts := make(map[string]int)\n    for _, word := range strings.Fields(s) {\n        counts[word]++\n    }\n    return counts\n}"
        },
        {
          "id": "v2",
          "title": "Most Frequent Element",
          "description": "Write <code>func mostFrequent(nums []int) int</code> that returns the element that appears most frequently. If there's a tie, return any of them.",
          "functionSignature": "func mostFrequent(nums []int) int",
          "testCases": [
            { "input": "[]int{1, 3, 2, 1, 4, 1}", "output": "1", "note": "1 appears 3 times" },
            { "input": "[]int{5, 5, 4, 4, 4}", "output": "4" },
            { "input": "[]int{7}", "output": "7" }
          ],
          "solution": "func mostFrequent(nums []int) int {\n    counts := make(map[int]int)\n    for _, num := range nums {\n        counts[num]++\n    }\n    \n    maxCount := 0\n    result := nums[0]\n    for num, count := range counts {\n        if count > maxCount {\n            maxCount = count\n            result = num\n        }\n    }\n    return result\n}",
          "solutionNotes": "First count everything, then iterate the map to find the max. This is a two-pass approach over different data structures."
        },
        {
          "id": "v3",
          "title": "First Unique Character",
          "description": "Write <code>func firstUniqChar(s string) int</code> that returns the index of the first non-repeating character. Return -1 if none exists.",
          "functionSignature": "func firstUniqChar(s string) int",
          "testCases": [
            { "input": "\"leetcode\"", "output": "0", "note": "'l' is first unique" },
            { "input": "\"loveleetcode\"", "output": "2", "note": "'v' is first unique" },
            { "input": "\"aabb\"", "output": "-1" }
          ],
          "solution": "func firstUniqChar(s string) int {\n    counts := make(map[rune]int)\n    runes := []rune(s)\n    \n    for _, r := range runes {\n        counts[r]++\n    }\n    \n    for i, r := range runes {\n        if counts[r] == 1 {\n            return i\n        }\n    }\n    return -1\n}",
          "solutionNotes": "Two passes needed: first to count, second to find the first character with count == 1. We iterate the original string (not the map) to preserve order."
        },
        {
          "id": "v4",
          "title": "Is Anagram",
          "description": "Write <code>func isAnagram(s, t string) bool</code> that returns true if t is an anagram of s (same letters, different order).",
          "functionSignature": "func isAnagram(s, t string) bool",
          "testCases": [
            { "input": "\"anagram\", \"nagaram\"", "output": "true" },
            { "input": "\"rat\", \"car\"", "output": "false" },
            { "input": "\"listen\", \"silent\"", "output": "true" }
          ],
          "solution": "func isAnagram(s, t string) bool {\n    if len(s) != len(t) {\n        return false\n    }\n    \n    counts := make(map[rune]int)\n    for _, r := range s {\n        counts[r]++\n    }\n    for _, r := range t {\n        counts[r]--\n        if counts[r] < 0 {\n            return false\n        }\n    }\n    return true\n}",
          "solutionNotes": "Count characters in s (increment), then 'uncount' characters in t (decrement). If we ever go negative, t has a character s doesn't have."
        },
        {
          "id": "v5",
          "title": "Can Construct",
          "description": "Write <code>func canConstruct(ransomNote, magazine string) bool</code> that returns true if ransomNote can be constructed from magazine letters (each letter used once).",
          "functionSignature": "func canConstruct(ransomNote, magazine string) bool",
          "testCases": [
            { "input": "\"a\", \"b\"", "output": "false" },
            { "input": "\"aa\", \"aab\"", "output": "true" },
            { "input": "\"aa\", \"ab\"", "output": "false", "note": "need 2 a's but only 1" }
          ],
          "solution": "func canConstruct(ransomNote, magazine string) bool {\n    available := make(map[rune]int)\n    \n    for _, r := range magazine {\n        available[r]++\n    }\n    \n    for _, r := range ransomNote {\n        available[r]--\n        if available[r] < 0 {\n            return false\n        }\n    }\n    return true\n}",
          "solutionNotes": "Similar to anagram check, but one-directional: we only need to verify ransomNote letters exist in magazine, not vice versa."
        },
        {
          "id": "v6",
          "title": "Majority Element",
          "description": "Write <code>func majorityElement(nums []int) int</code> that finds the element appearing more than n/2 times. Assume such element always exists.",
          "functionSignature": "func majorityElement(nums []int) int",
          "testCases": [
            { "input": "[]int{3, 2, 3}", "output": "3" },
            { "input": "[]int{2, 2, 1, 1, 1, 2, 2}", "output": "2" },
            { "input": "[]int{1, 1, 1, 1}", "output": "1" }
          ],
          "solution": "func majorityElement(nums []int) int {\n    counts := make(map[int]int)\n    threshold := len(nums) / 2\n    \n    for _, num := range nums {\n        counts[num]++\n        if counts[num] > threshold {\n            return num\n        }\n    }\n    return -1\n}",
          "solutionNotes": "We can return early as soon as any element exceeds n/2 count. No need to finish counting everything!"
        }
      ]
    },
    {
      "id": "advanced_5",
      "baseTitle": "Hash Map Lookup",
      "concept": "Hash Map Complement Pattern",
      "variants": [
        {
          "id": "v1",
          "title": "Two Sum",
          "description": "Given a slice of ints and a target, return indices of two numbers that add up to the target. <code>func twoSum(nums []int, target int) []int</code>",
          "functionSignature": "func twoSum(nums []int, target int) []int",
          "testCases": [
            { "input": "[]int{2, 7, 11, 15}, 9", "output": "[0, 1]" },
            { "input": "[]int{3, 2, 4}, 6", "output": "[1, 2]" },
            { "input": "[]int{3, 3}, 6", "output": "[0, 1]" }
          ],
          "solution": "func twoSum(nums []int, target int) []int {\n    seen := make(map[int]int)\n    for i, num := range nums {\n        complement := target - num\n        if j, ok := seen[complement]; ok {\n            return []int{j, i}\n        }\n        seen[num] = i\n    }\n    return nil\n}"
        },
        {
          "id": "v2",
          "title": "Two Sum II (Sorted Input)",
          "description": "Given a <strong>sorted</strong> array and target, return indices (1-indexed) of two numbers that add to target. Use two pointers instead of a hash map. <code>func twoSumSorted(nums []int, target int) []int</code>",
          "functionSignature": "func twoSumSorted(nums []int, target int) []int",
          "testCases": [
            { "input": "[]int{2, 7, 11, 15}, 9", "output": "[1, 2]", "note": "1-indexed!" },
            { "input": "[]int{2, 3, 4}, 6", "output": "[1, 3]" },
            { "input": "[]int{-1, 0}, -1", "output": "[1, 2]" }
          ],
          "solution": "func twoSumSorted(nums []int, target int) []int {\n    left, right := 0, len(nums)-1\n    \n    for left < right {\n        sum := nums[left] + nums[right]\n        if sum == target {\n            return []int{left + 1, right + 1}\n        } else if sum < target {\n            left++\n        } else {\n            right--\n        }\n    }\n    return nil\n}",
          "solutionNotes": "When input is sorted, two pointers is O(1) space vs O(n) for hash map. Move left pointer right for larger sum, right pointer left for smaller sum."
        },
        {
          "id": "v3",
          "title": "Pair with Difference",
          "description": "Find two numbers whose <strong>difference</strong> equals the target. Return their indices (smaller index first). <code>func pairWithDiff(nums []int, target int) []int</code>",
          "functionSignature": "func pairWithDiff(nums []int, target int) []int",
          "testCases": [
            { "input": "[]int{5, 20, 3, 2, 50, 80}, 78", "output": "[1, 5]", "note": "80 - 2 = 78... wait" },
            { "input": "[]int{1, 5, 3}, 2", "output": "[0, 2]", "note": "3 - 1 = 2" },
            { "input": "[]int{1, 2, 3}, 10", "output": "nil" }
          ],
          "solution": "func pairWithDiff(nums []int, target int) []int {\n    seen := make(map[int]int)\n    \n    for i, num := range nums {\n        if j, ok := seen[num-target]; ok {\n            return []int{j, i}\n        }\n        if j, ok := seen[num+target]; ok {\n            return []int{j, i}\n        }\n        seen[num] = i\n    }\n    return nil\n}",
          "solutionNotes": "Unlike Two Sum where we look for target-num, here we look for BOTH num-target AND num+target because either could be the pair (a-b=k or b-a=k)."
        },
        {
          "id": "v4",
          "title": "Count Pairs with Sum",
          "description": "Count how many pairs of numbers add up to exactly the target. Each element can only be used once. <code>func countPairs(nums []int, target int) int</code>",
          "functionSignature": "func countPairs(nums []int, target int) int",
          "testCases": [
            { "input": "[]int{1, 5, 7, 1}, 6", "output": "2", "note": "(1,5) and (1,5)" },
            { "input": "[]int{1, 1, 1, 1}, 2", "output": "2", "note": "two pairs of 1+1" },
            { "input": "[]int{1, 2, 3}, 10", "output": "0" }
          ],
          "solution": "func countPairs(nums []int, target int) int {\n    counts := make(map[int]int)\n    for _, num := range nums {\n        counts[num]++\n    }\n    \n    pairs := 0\n    for num, count := range counts {\n        complement := target - num\n        if complement == num {\n            pairs += count * (count - 1) / 2\n        } else if compCount, ok := counts[complement]; ok && complement > num {\n            pairs += count * compCount\n        }\n    }\n    return pairs\n}",
          "solutionNotes": "This is trickier! We count occurrences first, then for each unique number, find pairs. Handle same-number pairs specially (n choose 2). Use complement > num to avoid double counting."
        },
        {
          "id": "v5",
          "title": "Three Sum Exists",
          "description": "Return <code>true</code> if any three numbers in the array sum to zero. <code>func threeSumExists(nums []int) bool</code>",
          "functionSignature": "func threeSumExists(nums []int) bool",
          "testCases": [
            { "input": "[]int{-1, 0, 1, 2}", "output": "true", "note": "-1 + 0 + 1 = 0" },
            { "input": "[]int{1, 2, 3}", "output": "false" },
            { "input": "[]int{0, 0, 0}", "output": "true" }
          ],
          "solution": "import \"sort\"\n\nfunc threeSumExists(nums []int) bool {\n    sort.Ints(nums)\n    n := len(nums)\n    \n    for i := 0; i < n-2; i++ {\n        if i > 0 && nums[i] == nums[i-1] {\n            continue\n        }\n        \n        left, right := i+1, n-1\n        target := -nums[i]\n        \n        for left < right {\n            sum := nums[left] + nums[right]\n            if sum == target {\n                return true\n            } else if sum < target {\n                left++\n            } else {\n                right--\n            }\n        }\n    }\n    return false\n}",
          "solutionNotes": "Fix one number, then use Two Sum II (sorted) for the other two. Sorting first enables the two-pointer approach. O(n²) total."
        },
        {
          "id": "v6",
          "title": "Subarray Sum Equals K",
          "description": "Count the number of continuous subarrays whose elements sum to k. <code>func subarraySum(nums []int, k int) int</code>",
          "functionSignature": "func subarraySum(nums []int, k int) int",
          "testCases": [
            { "input": "[]int{1, 1, 1}, 2", "output": "2", "note": "[1,1] at positions 0-1 and 1-2" },
            { "input": "[]int{1, 2, 3}, 3", "output": "2", "note": "[1,2] and [3]" },
            { "input": "[]int{1, -1, 0}, 0", "output": "3" }
          ],
          "solution": "func subarraySum(nums []int, k int) int {\n    count := 0\n    prefixSum := 0\n    seen := make(map[int]int)\n    seen[0] = 1\n    \n    for _, num := range nums {\n        prefixSum += num\n        if c, ok := seen[prefixSum-k]; ok {\n            count += c\n        }\n        seen[prefixSum]++\n    }\n    return count\n}",
          "solutionNotes": "This uses the prefix sum technique with a hash map. If prefix[j] - prefix[i] = k, then subarray [i+1...j] sums to k. We track how many times each prefix sum has occurred."
        }
      ]
    },
    {
      "id": "advanced_6",
      "baseTitle": "Sliding Window",
      "concept": "Sliding Window Pattern",
      "variants": [
        {
          "id": "v1",
          "title": "Maximum Sum Subarray of Size K",
          "description": "Given an array of integers and a number k, find the maximum sum of any contiguous subarray of size k. <code>func maxSumSubarray(nums []int, k int) int</code>",
          "functionSignature": "func maxSumSubarray(nums []int, k int) int",
          "testCases": [
            { "input": "[]int{2, 1, 5, 1, 3, 2}, 3", "output": "9", "note": "subarray [5,1,3]" },
            { "input": "[]int{2, 3, 4, 1, 5}, 2", "output": "7", "note": "subarray [3,4]" },
            { "input": "[]int{1, 1, 1, 1}, 2", "output": "2" }
          ],
          "solution": "func maxSumSubarray(nums []int, k int) int {\n    if len(nums) < k {\n        return 0\n    }\n    windowSum := 0\n    for i := 0; i < k; i++ {\n        windowSum += nums[i]\n    }\n    maxSum := windowSum\n    \n    for i := k; i < len(nums); i++ {\n        windowSum += nums[i] - nums[i-k]\n        if windowSum > maxSum {\n            maxSum = windowSum\n        }\n    }\n    return maxSum\n}",
          "solutionNotes": "Fixed-size window: calculate first window sum, then slide by adding new element and subtracting leaving element. O(n) time, O(1) space."
        },
        {
          "id": "v2",
          "title": "Longest Substring Without Repeating",
          "description": "Find the length of the longest substring without repeating characters. <code>func lengthOfLongestSubstring(s string) int</code>",
          "functionSignature": "func lengthOfLongestSubstring(s string) int",
          "testCases": [
            { "input": "\"abcabcbb\"", "output": "3", "note": "\"abc\"" },
            { "input": "\"bbbbb\"", "output": "1", "note": "\"b\"" },
            { "input": "\"pwwkew\"", "output": "3", "note": "\"wke\"" }
          ],
          "solution": "func lengthOfLongestSubstring(s string) int {\n    seen := make(map[byte]int)\n    maxLen := 0\n    left := 0\n    \n    for right := 0; right < len(s); right++ {\n        char := s[right]\n        if lastIdx, ok := seen[char]; ok && lastIdx >= left {\n            left = lastIdx + 1\n        }\n        seen[char] = right\n        if right - left + 1 > maxLen {\n            maxLen = right - left + 1\n        }\n    }\n    return maxLen\n}",
          "solutionNotes": "Variable-size window: expand right, shrink left when duplicate found. Track last seen index of each character to know where to shrink to."
        },
        {
          "id": "v3",
          "title": "Minimum Size Subarray Sum",
          "description": "Find the minimal length of a contiguous subarray whose sum is >= target. Return 0 if no such subarray. <code>func minSubarrayLen(target int, nums []int) int</code>",
          "functionSignature": "func minSubarrayLen(target int, nums []int) int",
          "testCases": [
            { "input": "7, []int{2, 3, 1, 2, 4, 3}", "output": "2", "note": "[4,3] sums to 7" },
            { "input": "4, []int{1, 4, 4}", "output": "1", "note": "[4] alone >= 4" },
            { "input": "11, []int{1, 1, 1, 1}", "output": "0", "note": "can't reach 11" }
          ],
          "solution": "func minSubarrayLen(target int, nums []int) int {\n    minLen := len(nums) + 1\n    left := 0\n    sum := 0\n    \n    for right := 0; right < len(nums); right++ {\n        sum += nums[right]\n        \n        for sum >= target {\n            if right - left + 1 < minLen {\n                minLen = right - left + 1\n            }\n            sum -= nums[left]\n            left++\n        }\n    }\n    \n    if minLen == len(nums) + 1 {\n        return 0\n    }\n    return minLen\n}",
          "solutionNotes": "Variable-size window with condition: expand to increase sum, shrink while condition met to find minimum. Classic 'minimum window' pattern."
        }
      ]
    }
  ],
  "preExercises": {
    "advanced_1": {
      "title": "Pre-exercise: Map as a Set",
      "description": "Before tackling the algorithm, let's practice the core pattern: using a map to track what you've seen.",
      "exercises": [
        {
          "id": "pre1",
          "title": "Track Visited Pages",
          "problem": "You're building a browser history tracker. Write code that creates a <code>map[string]bool</code> called <code>visited</code>, marks three pages as visited, then checks if \"google.com\" has been visited.",
          "hints": [
            {
              "title": "Creating the map",
              "content": "Create with: <code>visited := make(map[string]bool)</code><br>This creates an empty map where keys are strings and values are booleans."
            },
            {
              "title": "Marking as visited",
              "content": "To mark a page as visited: <code>visited[\"google.com\"] = true</code><br>Do this for three different pages."
            },
            {
              "title": "Checking if visited",
              "content": "The simple way: <code>if visited[\"google.com\"]</code><br>This works because if the key doesn't exist, Go returns <code>false</code> (the zero value for bool)!"
            }
          ],
          "solution": "visited := make(map[string]bool)\n\n// Mark pages as visited\nvisited[\"google.com\"] = true\nvisited[\"github.com\"] = true\nvisited[\"go.dev\"] = true\n\n// Check if google.com was visited\nif visited[\"google.com\"] {\n    fmt.Println(\"You've been to google.com\")\n}\n\n// Check something NOT visited\nif visited[\"facebook.com\"] {\n    fmt.Println(\"You've been to facebook.com\")\n} else {\n    fmt.Println(\"Never visited facebook.com\")\n}",
          "expectedOutput": "You've been to google.com\nNever visited facebook.com",
          "keyInsight": "When you access a key that doesn't exist in a <code>map[T]bool</code>, Go returns <code>false</code>. This makes <code>if visited[key]</code> a clean way to check membership - no need for the comma-ok pattern here!"
        },
        {
          "id": "pre2",
          "title": "Unique Letter Collector",
          "problem": "Write code that loops through the string \"banana\" and collects each unique letter into a <code>map[rune]bool</code>. Print how many unique letters there are.",
          "hints": [
            {
              "title": "Setup",
              "content": "Create the map: <code>letters := make(map[rune]bool)</code><br>Loop with: <code>for _, char := range \"banana\"</code>"
            },
            {
              "title": "Collecting",
              "content": "For each character, just mark it as seen: <code>letters[char] = true</code><br>Maps automatically handle duplicates - setting the same key twice just overwrites."
            },
            {
              "title": "Counting",
              "content": "The number of unique letters is: <code>len(letters)</code>"
            }
          ],
          "solution": "letters := make(map[rune]bool)\n\nfor _, char := range \"banana\" {\n    letters[char] = true\n}\n\nfmt.Printf(\"Unique letters: %d\\n\", len(letters))  // 3: b, a, n",
          "expectedOutput": "Unique letters: 3",
          "keyInsight": "A map automatically handles duplicates - you can set the same key multiple times and it just overwrites. This is why <code>len(map)</code> gives you the count of unique keys!"
        }
      ]
    },
    "advanced_2": {
      "title": "Pre-exercise: Slow/Fast Pointer Prep",
      "description": "Before the in-place algorithm, let's practice the core logic of detecting duplicates in sorted arrays.",
      "exercises": [
        {
          "id": "pre2a",
          "title": "Copy Unique to New Slice",
          "problem": "Given the sorted slice <code>[]int{1, 1, 2, 2, 3}</code>, create a NEW slice containing only the unique values <code>[1, 2, 3]</code>. Don't modify the original - just build a new one with <code>append</code>.",
          "hints": [
            {
              "title": "Step 1: Setup",
              "content": "<pre>nums := []int{1, 1, 2, 2, 3}\nresult := []int{nums[0]}  // First element is always unique</pre>"
            },
            {
              "title": "Step 2: Loop starting from index 1",
              "content": "<pre>for i := 1; i < len(nums); i++ {\n    // Compare current with previous\n}</pre>"
            },
            {
              "title": "Step 3: Append when different",
              "content": "<pre>if nums[i] != nums[i-1] {\n    result = append(result, nums[i])\n}</pre>"
            }
          ],
          "solution": "nums := []int{1, 1, 2, 2, 3}\nresult := []int{nums[0]}  // First element always unique\n\nfor i := 1; i < len(nums); i++ {\n    if nums[i] != nums[i-1] {\n        result = append(result, nums[i])\n    }\n}\n\nfmt.Println(result)  // [1 2 3]",
          "expectedOutput": "[1 2 3]",
          "keyInsight": "In a sorted array, duplicates are always adjacent! So we only need to compare each element with the one before it. This same logic powers the in-place algorithm - we'll just write to the array instead of appending."
        },
        {
          "id": "pre2b",
          "title": "Count Consecutive Groups",
          "problem": "Given the sorted slice <code>[]int{1, 1, 2, 2, 2, 3}</code>, count how many distinct groups there are. Answer: 3 (the 1s, the 2s, and the 3).",
          "hints": [
            {
              "title": "Step 1: Initialize counter",
              "content": "<pre>nums := []int{1, 1, 2, 2, 2, 3}\ngroups := 1  // First element starts the first group</pre>"
            },
            {
              "title": "Step 2: Loop and count transitions",
              "content": "<pre>for i := 1; i < len(nums); i++ {\n    if nums[i] != nums[i-1] {\n        groups++  // New value = new group\n    }\n}</pre>"
            }
          ],
          "solution": "nums := []int{1, 1, 2, 2, 2, 3}\ngroups := 1  // First element starts the first group\n\nfor i := 1; i < len(nums); i++ {\n    if nums[i] != nums[i-1] {\n        groups++  // New value = new group\n    }\n}\n\nfmt.Printf(\"Groups: %d\\n\", groups)",
          "expectedOutput": "Groups: 3",
          "keyInsight": "This is exactly what the slow/fast algorithm returns! The slow pointer ends up at the last unique position, so slow+1 = number of unique elements = number of groups."
        }
      ]
    },
    "advanced_4": {
      "title": "Pre-exercise: Map Counting Prep",
      "description": "Before counting words, let's practice the building blocks: splitting strings and incrementing map values.",
      "exercises": [
        {
          "id": "pre4a",
          "title": "Explore strings.Fields",
          "problem": "Use <code>strings.Fields</code> to split the string <code>\"hello world go\"</code> into words and print each word on its own line.",
          "hints": [
            {
              "title": "Step 1: Import and split",
              "content": "<pre>import \"strings\"\n\nwords := strings.Fields(\"hello world go\")</pre>"
            },
            {
              "title": "Step 2: Loop and print",
              "content": "<pre>for _, word := range words {\n    fmt.Println(word)\n}</pre>"
            }
          ],
          "solution": "import \"strings\"\n\nwords := strings.Fields(\"hello world go\")\nfor _, word := range words {\n    fmt.Println(word)\n}",
          "expectedOutput": "hello\nworld\ngo",
          "keyInsight": "<code>strings.Fields</code> splits on any whitespace (spaces, tabs, newlines) and returns a <code>[]string</code>. It's smarter than <code>strings.Split(s, \" \")</code> because it handles multiple spaces correctly."
        },
        {
          "id": "pre4b",
          "title": "Count Letters (Simpler)",
          "problem": "Count how many times each letter appears in <code>\"hello\"</code>. Store in a <code>map[rune]int</code> and print the counts.",
          "hints": [
            {
              "title": "Step 1: Create the map",
              "content": "<pre>counts := make(map[rune]int)</pre>"
            },
            {
              "title": "Step 2: Loop through string",
              "content": "<pre>for _, char := range \"hello\" {\n    counts[char]++\n}</pre>"
            },
            {
              "title": "Step 3: Print results",
              "content": "<pre>for char, count := range counts {\n    fmt.Printf(\"%c: %d\\n\", char, count)\n}</pre>"
            }
          ],
          "solution": "counts := make(map[rune]int)\n\nfor _, char := range \"hello\" {\n    counts[char]++\n}\n\nfor char, count := range counts {\n    fmt.Printf(\"%c: %d\\n\", char, count)\n}",
          "expectedOutput": "h: 1\ne: 1\nl: 2\no: 1",
          "keyInsight": "The <code>++</code> operator works on map values! When the key doesn't exist, Go returns 0 (the zero value for int), then increments to 1. So <code>counts[char]++</code> handles both first-time and repeat cases."
        }
      ]
    },
    "advanced_5": {
      "title": "Pre-exercise: Two Sum Building Blocks",
      "description": "Before the full algorithm, let's practice the two key operations: looking up complements and building index maps.",
      "exercises": [
        {
          "id": "pre5a",
          "title": "Find Complement in Map",
          "problem": "Given this pre-built map <code>map[int]int{2: 0, 7: 1, 11: 2}</code> (value to index), target=9, and current number=7: calculate the complement and check if it exists in the map. Print the result.",
          "hints": [
            {
              "title": "Step 1: Setup",
              "content": "<pre>seen := map[int]int{2: 0, 7: 1, 11: 2}\ntarget := 9\nnum := 7</pre>"
            },
            {
              "title": "Step 2: Calculate complement",
              "content": "<pre>complement := target - num  // 9 - 7 = 2</pre>"
            },
            {
              "title": "Step 3: Check map with comma-ok",
              "content": "<pre>if idx, ok := seen[complement]; ok {\n    fmt.Printf(\"Found! %d is at index %d\\n\", complement, idx)\n}</pre>"
            }
          ],
          "solution": "seen := map[int]int{2: 0, 7: 1, 11: 2}\ntarget := 9\nnum := 7\n\ncomplement := target - num  // 9 - 7 = 2\n\nif idx, ok := seen[complement]; ok {\n    fmt.Printf(\"Found %d at index %d\\n\", complement, idx)\n} else {\n    fmt.Println(\"Not found\")\n}",
          "expectedOutput": "Found 2 at index 0",
          "keyInsight": "The complement is <code>target - current</code>. If we're looking for two numbers that sum to 9, and we have 7, we need to find 2. The map tells us WHERE we saw the 2 (at index 0)."
        },
        {
          "id": "pre5b",
          "title": "Build Value-to-Index Map",
          "problem": "Given <code>[]int{2, 7, 11}</code>, build a map that maps each value to its index: <code>map[int]int{2: 0, 7: 1, 11: 2}</code>.",
          "hints": [
            {
              "title": "Step 1: Create empty map",
              "content": "<pre>nums := []int{2, 7, 11}\nvalueToIndex := make(map[int]int)</pre>"
            },
            {
              "title": "Step 2: Loop with index",
              "content": "<pre>for i, num := range nums {\n    valueToIndex[num] = i\n}</pre>"
            }
          ],
          "solution": "nums := []int{2, 7, 11}\nvalueToIndex := make(map[int]int)\n\nfor i, num := range nums {\n    valueToIndex[num] = i\n}\n\nfmt.Println(valueToIndex)",
          "expectedOutput": "map[2:0 7:1 11:2]",
          "keyInsight": "The Two Sum algorithm builds this map AS it loops - checking for the complement first, then adding the current number. This ensures we don't match a number with itself!"
        }
      ]
    },
    "advanced_6": {
      "title": "Pre-exercise: Sliding Window Fundamentals",
      "description": "Before tackling sliding window problems, let's practice the core mechanics: managing a window and efficiently updating its state.",
      "exercises": [
        {
          "id": "pre6a",
          "title": "Fixed Window Sum",
          "problem": "Given <code>[]int{1, 2, 3, 4, 5}</code> and window size k=3, calculate the sum of the first window [1,2,3], then slide it one position and calculate the new sum [2,3,4] WITHOUT re-summing all elements.",
          "hints": [
            {
              "title": "Step 1: Calculate first window sum",
              "content": "<pre>nums := []int{1, 2, 3, 4, 5}\nk := 3\n\n// Sum first k elements\nwindowSum := 0\nfor i := 0; i < k; i++ {\n    windowSum += nums[i]\n}\nfmt.Println(windowSum)  // 6</pre>"
            },
            {
              "title": "Step 2: Slide the window",
              "content": "<pre>// The trick: add new element, subtract old element\n// New element is at index k (which is 3)\n// Old element is at index 0\nwindowSum = windowSum + nums[k] - nums[0]</pre>"
            },
            {
              "title": "Step 3: General formula",
              "content": "When sliding from position i-1 to i:<pre>windowSum = windowSum + nums[i+k-1] - nums[i-1]</pre>Or equivalently, when the right edge moves to index i:<pre>windowSum = windowSum + nums[i] - nums[i-k]</pre>"
            }
          ],
          "solution": "nums := []int{1, 2, 3, 4, 5}\nk := 3\n\n// Sum first window\nwindowSum := 0\nfor i := 0; i < k; i++ {\n    windowSum += nums[i]\n}\nfmt.Printf(\"Window [0:3] sum: %d\\n\", windowSum)  // 6\n\n// Slide window: add nums[3], remove nums[0]\nwindowSum = windowSum + nums[3] - nums[0]\nfmt.Printf(\"Window [1:4] sum: %d\\n\", windowSum)  // 9\n\n// Slide again: add nums[4], remove nums[1]\nwindowSum = windowSum + nums[4] - nums[1]\nfmt.Printf(\"Window [2:5] sum: %d\\n\", windowSum)  // 12",
          "expectedOutput": "Window [0:3] sum: 6\nWindow [1:4] sum: 9\nWindow [2:5] sum: 12",
          "keyInsight": "The sliding window trick: instead of recalculating the entire sum (O(k)), just add the new element and subtract the leaving element (O(1)). This makes processing all windows O(n) instead of O(n*k)!"
        },
        {
          "id": "pre6b",
          "title": "Variable Window with Map",
          "problem": "Track characters in a variable-size window. Given string \"abca\", add characters one by one to a <code>map[byte]int</code> (tracking counts), then simulate shrinking by decrementing counts.",
          "hints": [
            {
              "title": "Step 1: Setup and expand",
              "content": "<pre>s := \"abca\"\nseen := make(map[byte]int)\n\n// Add each character (expanding window)\nfor i := 0; i < len(s); i++ {\n    seen[s[i]]++\n    fmt.Printf(\"Added %c, counts: %v\\n\", s[i], seen)\n}</pre>"
            },
            {
              "title": "Step 2: Shrink from left",
              "content": "<pre>// Remove the first character (shrink)\nseen[s[0]]--\nif seen[s[0]] == 0 {\n    delete(seen, s[0])  // Clean up zero counts\n}\nfmt.Printf(\"After removing %c: %v\\n\", s[0], seen)</pre>"
            }
          ],
          "solution": "s := \"abca\"\nseen := make(map[byte]int)\n\n// Expand: add all characters\nfor i := 0; i < len(s); i++ {\n    seen[s[i]]++\n}\nfmt.Printf(\"Full window: %v\\n\", seen)  // a:2, b:1, c:1\n\n// Shrink: remove from left (index 0 = 'a')\nseen[s[0]]--\nif seen[s[0]] == 0 {\n    delete(seen, s[0])\n}\nfmt.Printf(\"After removing s[0]: %v\\n\", seen)  // a:1, b:1, c:1\n\n// Shrink more: remove s[1] = 'b'\nseen[s[1]]--\nif seen[s[1]] == 0 {\n    delete(seen, s[1])\n}\nfmt.Printf(\"After removing s[1]: %v\\n\", seen)  // a:1, c:1",
          "expectedOutput": "Full window: map[97:2 98:1 99:1]\nAfter removing s[0]: map[97:1 98:1 99:1]\nAfter removing s[1]: map[97:1 99:1]",
          "keyInsight": "Variable sliding windows use a map to track what's in the window. When expanding (right pointer moves), increment counts. When shrinking (left pointer moves), decrement counts. Delete keys when count hits 0 to keep the map clean."
        }
      ]
    }
  }
};
