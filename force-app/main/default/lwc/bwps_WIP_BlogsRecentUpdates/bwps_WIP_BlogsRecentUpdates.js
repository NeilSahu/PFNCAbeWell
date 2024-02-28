import { api, LightningElement } from 'lwc';
import blogs from '@salesforce/resourceUrl/WebsiteGeneralFiles';

export default class Bwps_WIP_BlogsRecentUpdates extends LightningElement {
    
    // blog_photo = `${blogs}/WebsiteGeneralFiles/blog_photo.png`;
    // blog_1 = `${blogs}/WebsiteGeneralFiles/blog_1.png`;
    /*
    data = {
        "blogs": [
            {
                "id": 0,
                "photo": this.blog_photo,
                "auther": "ZACH GALATI",
                "date": "MARCH 23, 2021",
                "heading": "8 Tips for Surviving the Winter with Parkinson's",
                "description": "There are many issues and complications that can arise during the winter when you or a loved one has Parkinson's disease.",
                "info": [
                    {
                        "id": "i1",
                        "para": "There are many issues and complications that can arise during the winter when you or a loved one has Parkinson's disease. The cold weather and snow can not only aggravate your symptoms but can affect your daily routines as well. So, we decided to compile a list of 8 tips for surviving the winter with Parkinson's that can help you this winter."
                    },
                    {
                        "id": "i2",
                        "sub": "1. Avoid going outside when possible",
                        "para": "Since the cold weather can often aggravate aspects of your battle with Parkinson's disease it is often better to avoid going outside. Stocking up on groceries or ordering household supplies online can help to reduce your time outside. If you need to get chores done outside of the home reach out to a friend or family member for help."
                    },
                    {
                        "id": "i3",
                        "sub": "2. Keep up your exercise routine",
                        "para": "With the snow and cold weather limiting how much exercise you can do outside, it can be difficult to keep up with your daily exercise routine. So, plan to change-up your exercise routine for the winter so that it will not be dependent on the weather. Luckily, COVID-19 has been preparing us for this all year and PFNCA offers live and pre-recorded wellness programs you can do from home."
                    },
                    {
                        "id": "i4",
                        "sub": "3. When you have to go outside make sure to dress in layers",
                        "para": "When leaving your home for any reason make sure to bundle up and wear layers. This can mean doubling up on socks, gloves, shirts, and trousers. And don't forget to have a scarf or any item of clothing that can cover up your face if need be."
                    },
                    {
                        "id": "i5",
                        "sub": " 4. Keep warm in your home",
                        "para": "Once you get cold it is much more difficult to get warm again. So, make sure that you are dressing in layers inside and keeping the heat up in your home."
                    },
                    {
                        "id": "i6",
                        "sub": "5. Prepare for traveling in the winter",
                        "para": "When traveling during the winter, the last thing you want is to be stuck on the side of the road unprepared. That's why it is important to keep supplies on hand in your car to stay warm and to call for help in the case of an emergency."
                    },
                    {
                        "id": "i7",
                        "sub": "6. Have a plan in place in case you are snowed in or the power goes off",
                        "para": "If you get snowed in or the power goes out due to the snow, it is important to be prepared. Always have excess food, medication, and blankets on hand so that you can stay warm and stay fed until the snow melts and it is safe to go out again."
                    },
                    {
                        "id": "i8",
                        "sub": "7. Prepare for seasonal depression",
                        "para": "Some with Parkinson's disease experience depression and this can usually be exacerbated by the common \"seasonal depression\". It is important to know what factors can cause you to become depressed and it is also important to talk to your doctor if feelings of depression increase."
                    },
                    {
                        "id": "i9",
                        "sub": "8. Preventing falls and accidents",
                        "para": "With ice and slippery snow everywhere this time of year it is important to take precautions to avoid falls or accidents. Make sure that you wear the appropriate footwear with extra grip to avoid excessive slipping. It is also important to use handrails and anything available at all times to help keep you stabilized and balanced."
                    },
                    {
                        "id": "i10",
                        "sub": "",
                        "para": "We hope these tips will be helpful for you this winter and if you would like to learn more about great ways to stay active this winter, check out the different exercise programs we offer at no cost."
                    },
                    {
                        "id": "i11",
                        "sub": "",
                        "para": "Stay warm!"
                    },


                ]

            },
            {
                "id": 1,
                "photo": this.blog_photo,
                "auther": "ZACH GALATI",
                "date": "MARCH 23, 2021",
                "heading": "Lessons from Being the Child of a parent with Parkinson's.",
                "description": "Parkinson Foundation of the National Capital Area (PFNCA) helps people with Parkinson's slow the disease's progression.",
                "info": [
                    {
                        "id": "i1",
                        "para": "There are many issues and complications that can arise during the winter when you or a loved one has Parkinson's disease. The cold weather and snow can not only aggravate your symptoms but can affect your daily routines as well. So, we decided to compile a list of 8 tips for surviving the winter with Parkinson's that can help you this winter."
                    },
                    {
                        "id": "i2",
                        "sub": "1. Avoid going outside when possible",
                        "para": "Since the cold weather can often aggravate aspects of your battle with Parkinson's disease it is often better to avoid going outside. Stocking up on groceries or ordering household supplies online can help to reduce your time outside. If you need to get chores done outside of the home reach out to a friend or family member for help."
                    },
                    {
                        "id": "i3",
                        "sub": "2. Keep up your exercise routine",
                        "para": "With the snow and cold weather limiting how much exercise you can do outside, it can be difficult to keep up with your daily exercise routine. So, plan to change-up your exercise routine for the winter so that it will not be dependent on the weather. Luckily, COVID-19 has been preparing us for this all year and PFNCA offers live and pre-recorded wellness programs you can do from home."
                    },
                    {
                        "id": "i4",
                        "sub": "3. When you have to go outside make sure to dress in layers",
                        "para": "When leaving your home for any reason make sure to bundle up and wear layers. This can mean doubling up on socks, gloves, shirts, and trousers. And don't forget to have a scarf or any item of clothing that can cover up your face if need be."
                    },
                    {
                        "id": "i5",
                        "sub": " 4. Keep warm in your home",
                        "para": "Once you get cold it is much more difficult to get warm again. So, make sure that you are dressing in layers inside and keeping the heat up in your home."
                    },
                    {
                        "id": "i6",
                        "sub": "5. Prepare for traveling in the winter",
                        "para": "When traveling during the winter, the last thing you want is to be stuck on the side of the road unprepared. That's why it is important to keep supplies on hand in your car to stay warm and to call for help in the case of an emergency."
                    },
                    {
                        "id": "i7",
                        "sub": "6. Have a plan in place in case you are snowed in or the power goes off",
                        "para": "If you get snowed in or the power goes out due to the snow, it is important to be prepared. Always have excess food, medication, and blankets on hand so that you can stay warm and stay fed until the snow melts and it is safe to go out again."
                    },
                    {
                        "id": "i8",
                        "sub": "7. Prepare for seasonal depression",
                        "para": "Some with Parkinson's disease experience depression and this can usually be exacerbated by the common \"seasonal depression\". It is important to know what factors can cause you to become depressed and it is also important to talk to your doctor if feelings of depression increase."
                    },
                    {
                        "id": "i9",
                        "sub": "8. Preventing falls and accidents",
                        "para": "With ice and slippery snow everywhere this time of year it is important to take precautions to avoid falls or accidents. Make sure that you wear the appropriate footwear with extra grip to avoid excessive slipping. It is also important to use handrails and anything available at all times to help keep you stabilized and balanced."
                    },
                    {
                        "id": "i10",
                        "sub": "",
                        "para": "We hope these tips will be helpful for you this winter and if you would like to learn more about great ways to stay active this winter, check out the different exercise programs we offer at no cost."
                    },
                    {
                        "id": "i11",
                        "sub": "",
                        "para": "Stay warm!"
                    },


                ]

            },
            {
                "id": 2,
                "photo": this.blog_1,
                "auther": "ZACH GALATI",
                "date": "MARCH 23, 2021",
                "heading": "Lessons from Being the Child of a parent with Parkinson's.",
                "description": "Parkinson Foundation of the National Capital Area (PFNCA) helps people with Parkinson's slow the disease's progression.",
                "info": [
                    {
                        "id": "i1",
                        "para": "There are many issues and complications that can arise during the winter when you or a loved one has Parkinson's disease. The cold weather and snow can not only aggravate your symptoms but can affect your daily routines as well. So, we decided to compile a list of 8 tips for surviving the winter with Parkinson's that can help you this winter."
                    },
                    {
                        "id": "i2",
                        "sub": "1. Avoid going outside when possible",
                        "para": "Since the cold weather can often aggravate aspects of your battle with Parkinson's disease it is often better to avoid going outside. Stocking up on groceries or ordering household supplies online can help to reduce your time outside. If you need to get chores done outside of the home reach out to a friend or family member for help."
                    },
                    {
                        "id": "i3",
                        "sub": "2. Keep up your exercise routine",
                        "para": "With the snow and cold weather limiting how much exercise you can do outside, it can be difficult to keep up with your daily exercise routine. So, plan to change-up your exercise routine for the winter so that it will not be dependent on the weather. Luckily, COVID-19 has been preparing us for this all year and PFNCA offers live and pre-recorded wellness programs you can do from home."
                    },
                    {
                        "id": "i4",
                        "sub": "3. When you have to go outside make sure to dress in layers",
                        "para": "When leaving your home for any reason make sure to bundle up and wear layers. This can mean doubling up on socks, gloves, shirts, and trousers. And don't forget to have a scarf or any item of clothing that can cover up your face if need be."
                    },
                    {
                        "id": "i5",
                        "sub": " 4. Keep warm in your home",
                        "para": "Once you get cold it is much more difficult to get warm again. So, make sure that you are dressing in layers inside and keeping the heat up in your home."
                    },
                    {
                        "id": "i6",
                        "sub": "5. Prepare for traveling in the winter",
                        "para": "When traveling during the winter, the last thing you want is to be stuck on the side of the road unprepared. That's why it is important to keep supplies on hand in your car to stay warm and to call for help in the case of an emergency."
                    },
                    {
                        "id": "i7",
                        "sub": "6. Have a plan in place in case you are snowed in or the power goes off",
                        "para": "If you get snowed in or the power goes out due to the snow, it is important to be prepared. Always have excess food, medication, and blankets on hand so that you can stay warm and stay fed until the snow melts and it is safe to go out again."
                    },
                    {
                        "id": "i8",
                        "sub": "7. Prepare for seasonal depression",
                        "para": "Some with Parkinson's disease experience depression and this can usually be exacerbated by the common \"seasonal depression\". It is important to know what factors can cause you to become depressed and it is also important to talk to your doctor if feelings of depression increase."
                    },
                    {
                        "id": "i9",
                        "sub": "8. Preventing falls and accidents",
                        "para": "With ice and slippery snow everywhere this time of year it is important to take precautions to avoid falls or accidents. Make sure that you wear the appropriate footwear with extra grip to avoid excessive slipping. It is also important to use handrails and anything available at all times to help keep you stabilized and balanced."
                    },
                    {
                        "id": "i10",
                        "sub": "",
                        "para": "We hope these tips will be helpful for you this winter and if you would like to learn more about great ways to stay active this winter, check out the different exercise programs we offer at no cost."
                    },
                    {
                        "id": "i11",
                        "sub": "",
                        "para": "Stay warm!"
                    },


                ]


            },
            {
                "id": 3,
                "photo": this.blog_1,
                "auther": "ZACH GALATI",
                "date": "MARCH 23, 2021",
                "heading": "Lessons from Being the Child of a parent with Parkinson's.",
                "description": "Parkinson Foundation of the National Capital Area (PFNCA) helps people with Parkinson's slow the disease's progression.",
                "info": [
                    {
                        "id": "i1",
                        "para": "There are many issues and complications that can arise during the winter when you or a loved one has Parkinson's disease. The cold weather and snow can not only aggravate your symptoms but can affect your daily routines as well. So, we decided to compile a list of 8 tips for surviving the winter with Parkinson's that can help you this winter."
                    },
                    {
                        "id": "i2",
                        "sub": "1. Avoid going outside when possible",
                        "para": "Since the cold weather can often aggravate aspects of your battle with Parkinson's disease it is often better to avoid going outside. Stocking up on groceries or ordering household supplies online can help to reduce your time outside. If you need to get chores done outside of the home reach out to a friend or family member for help."
                    },
                    {
                        "id": "i3",
                        "sub": "2. Keep up your exercise routine",
                        "para": "With the snow and cold weather limiting how much exercise you can do outside, it can be difficult to keep up with your daily exercise routine. So, plan to change-up your exercise routine for the winter so that it will not be dependent on the weather. Luckily, COVID-19 has been preparing us for this all year and PFNCA offers live and pre-recorded wellness programs you can do from home."
                    },
                    {
                        "id": "i4",
                        "sub": "3. When you have to go outside make sure to dress in layers",
                        "para": "When leaving your home for any reason make sure to bundle up and wear layers. This can mean doubling up on socks, gloves, shirts, and trousers. And don't forget to have a scarf or any item of clothing that can cover up your face if need be."
                    },
                    {
                        "id": "i5",
                        "sub": " 4. Keep warm in your home",
                        "para": "Once you get cold it is much more difficult to get warm again. So, make sure that you are dressing in layers inside and keeping the heat up in your home."
                    },
                    {
                        "id": "i6",
                        "sub": "5. Prepare for traveling in the winter",
                        "para": "When traveling during the winter, the last thing you want is to be stuck on the side of the road unprepared. That's why it is important to keep supplies on hand in your car to stay warm and to call for help in the case of an emergency."
                    },
                    {
                        "id": "i7",
                        "sub": "6. Have a plan in place in case you are snowed in or the power goes off",
                        "para": "If you get snowed in or the power goes out due to the snow, it is important to be prepared. Always have excess food, medication, and blankets on hand so that you can stay warm and stay fed until the snow melts and it is safe to go out again."
                    },
                    {
                        "id": "i8",
                        "sub": "7. Prepare for seasonal depression",
                        "para": "Some with Parkinson's disease experience depression and this can usually be exacerbated by the common \"seasonal depression\". It is important to know what factors can cause you to become depressed and it is also important to talk to your doctor if feelings of depression increase."
                    },
                    {
                        "id": "i9",
                        "sub": "8. Preventing falls and accidents",
                        "para": "With ice and slippery snow everywhere this time of year it is important to take precautions to avoid falls or accidents. Make sure that you wear the appropriate footwear with extra grip to avoid excessive slipping. It is also important to use handrails and anything available at all times to help keep you stabilized and balanced."
                    },
                    {
                        "id": "i10",
                        "sub": "",
                        "para": "We hope these tips will be helpful for you this winter and if you would like to learn more about great ways to stay active this winter, check out the different exercise programs we offer at no cost."
                    },
                    {
                        "id": "i11",
                        "sub": "",
                        "para": "Stay warm!"
                    },


                ]


            },
            
            
        ]
    }
    */

    // recentUpdatesBlogs = this.data.blogs.slice(0,3);
    @api recentUpdatesBlogs = [];
    blogId = "";
    handleBlogClick(event){
        
        this.blogId = event.target.dataset.id;

        this.dispatchEvent( 
            new CustomEvent(
                'recentblogclick', 
                    { detail: { blogId: this.blogId } }
            ) 
        );

        

    }

    

}